import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

async function cleanSpaces() {
  try {
    console.log('Limpando vagas e sessões...');

    // 1. Liberar todas as vagas
    const { error: spacesError } = await supabase
      .from('parking_spaces')
      .update({ status: 'free' })
      .eq('status', 'occupied');

    if (spacesError) {
      console.error('Erro ao liberar vagas:', spacesError);
    } else {
      console.log('✅ Todas as vagas foram liberadas');
    }

    // 2. Marcar todas as sessões ativas como canceladas
    const { data: activeSessions, error: sessionsError } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('status', 'active');

    if (sessionsError) {
      console.error('Erro ao buscar sessões:', sessionsError);
    } else {
      console.log(`Encontradas ${activeSessions?.length || 0} sessões ativas`);

      if (activeSessions && activeSessions.length > 0) {
        const { error: updateError } = await supabase
          .from('parking_sessions')
          .update({ 
            status: 'completed',
            exit_time: new Date().toISOString(),
            duration_minutes: 0,
            cost: 0
          })
          .eq('status', 'active');

        if (updateError) {
          console.error('Erro ao cancelar sessões:', updateError);
        } else {
          console.log('✅ Sessões ativas foram finalizadas');
        }
      }
    }

    console.log('\n===========================================');
    console.log('Limpeza concluída!');
    console.log('===========================================\n');

  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

cleanSpaces();
