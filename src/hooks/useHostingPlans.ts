import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type HostingPlan = Tables<'hosting_plans'>;

export const useHostingPlans = (category?: string) => {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        let query = supabase
          .from('hosting_plans')
          .select('*')
          .eq('is_active', true);

        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query.order('price', { ascending: true });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error fetching hosting plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [category]);

  return { plans, loading };
};