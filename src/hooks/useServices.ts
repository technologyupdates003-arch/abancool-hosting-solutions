import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { User } from '@supabase/supabase-js';

type Service = Tables<'services'> & {
  hosting_plans: Tables<'hosting_plans'>;
};

export const useServices = (user: User | null) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setServices([]);
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select(`
            *,
            hosting_plans (*)
          `)
          .eq('user_id', user.id);

        if (error) throw error;
        setServices(data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  return { services, loading };
};