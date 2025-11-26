-- Schema para o banco de dados Supabase

-- Tabela de usuários (estende auth.users do Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vagas de estacionamento
CREATE TABLE IF NOT EXISTS parking_spaces (
  id TEXT PRIMARY KEY, -- A01, A02, etc.
  section TEXT NOT NULL, -- A, B, C, etc.
  number INTEGER NOT NULL,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'occupied', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de veículos dos usuários
CREATE TABLE IF NOT EXISTS user_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plate TEXT NOT NULL,
  model TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plate)
);

-- Tabela de registro de estacionamentos (histórico)
CREATE TABLE IF NOT EXISTS parking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES user_vehicles(id) ON DELETE CASCADE,
  space_id TEXT NOT NULL REFERENCES parking_spaces(id),
  plate TEXT NOT NULL,
  entry_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  exit_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  cost DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_parking_sessions_user_id ON parking_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_parking_sessions_status ON parking_sessions(status);
CREATE INDEX IF NOT EXISTS idx_parking_spaces_status ON parking_spaces(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Profiles: Permitir criação de perfil durante registro
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for authentication"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- User Vehicles: Usuários só veem seus próprios veículos
ALTER TABLE user_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles"
  ON user_vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
  ON user_vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON user_vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON user_vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- Parking Spaces: Todos podem ver, apenas admins modificam
ALTER TABLE parking_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parking spaces"
  ON parking_spaces FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify parking spaces"
  ON parking_spaces FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Parking Sessions: Usuários veem apenas suas sessões, admins veem tudo
ALTER TABLE parking_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON parking_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions"
  ON parking_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create own sessions"
  ON parking_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON parking_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- Inserir as 300 vagas (A01-P20)
INSERT INTO parking_spaces (id, section, number)
SELECT 
  section || LPAD(number::TEXT, 2, '0'),
  section,
  number
FROM 
  (SELECT chr(ascii('A') + gs) as section FROM generate_series(0, 15) gs) sections,
  generate_series(1, 20) number
ON CONFLICT (id) DO NOTHING;
