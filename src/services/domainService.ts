import { supabase } from "@/integrations/supabase/client";

export interface DomainTLD {
  tld: string;
  price_usd: number;
  price_kes: number;
  price_zar: number;
  registration_period: number;
  is_active: boolean;
}

export interface DomainSearchResult {
  domain: string;
  available: boolean;
  price_usd?: number;
  price_kes?: number;
  price_zar?: number;
  currency?: string;
  error?: string;
}

export type Currency = 'USD' | 'KES' | 'ZAR';

class DomainService {
  // Get available TLDs and their pricing from database
  async getTLDs(): Promise<DomainTLD[]> {
    try {
      const { data, error } = await supabase
        .from('domain_tlds')
        .select('*')
        .eq('is_active', true)
        .order('tld');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching TLDs:', error);
      // Fallback to static data if database fails
      return [
        { tld: ".com", price_usd: 12.99, price_kes: 1950.00, price_zar: 240.00, registration_period: 1, is_active: true },
        { tld: ".co.ke", price_usd: 4.99, price_kes: 750.00, price_zar: 92.00, registration_period: 1, is_active: true },
        { tld: ".africa", price_usd: 11.99, price_kes: 1800.00, price_zar: 220.00, registration_period: 1, is_active: true },
        { tld: ".online", price_usd: 2.99, price_kes: 450.00, price_zar: 55.00, registration_period: 1, is_active: true },
        { tld: ".ke", price_usd: 29.99, price_kes: 4500.00, price_zar: 550.00, registration_period: 1, is_active: true },
      ];
    }
  }

  // Get price for specific TLD in specific currency
  getPriceForCurrency(tld: DomainTLD, currency: Currency): number {
    switch (currency) {
      case 'USD': return tld.price_usd;
      case 'KES': return tld.price_kes;
      case 'ZAR': return tld.price_zar;
      default: return tld.price_usd;
    }
  }

  // Format price with currency symbol
  formatPrice(price: number, currency: Currency): string {
    switch (currency) {
      case 'USD': return `$${price.toFixed(2)}`;
      case 'KES': return `KSh ${price.toFixed(2)}`;
      case 'ZAR': return `R${price.toFixed(2)}`;
      default: return `$${price.toFixed(2)}`;
    }
  }

  // Check domain availability (mock implementation)
  async checkDomainAvailability(domain: string): Promise<DomainSearchResult> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock domain availability check
      // In a real implementation, you'd call a domain registrar API like:
      // - Namecheap API
      // - GoDaddy API  
      // - ResellerClub API
      // - Or your domain provider's API

      const isAvailable = Math.random() > 0.3; // 70% chance domain is available
      const tld = domain.includes('.') ? '.' + domain.split('.').pop() : '.com';
      
      const tlds = await this.getTLDs();
      const tldInfo = tlds.find(t => t.tld === tld);
      
      return {
        domain,
        available: isAvailable,
        price_usd: tldInfo?.price_usd,
        price_kes: tldInfo?.price_kes,
        price_zar: tldInfo?.price_zar
      };
    } catch (error) {
      console.error('Error checking domain availability:', error);
      return {
        domain,
        available: false,
        error: 'Failed to check domain availability'
      };
    }
  }

  // Search multiple TLDs for a domain name
  async searchDomain(domainName: string, tlds?: string[]): Promise<DomainSearchResult[]> {
    try {
      const availableTLDs = await this.getTLDs();
      const searchTLDs = tlds || availableTLDs.map(t => t.tld);
      
      const results = await Promise.all(
        searchTLDs.map(tld => {
          const fullDomain = domainName.includes('.') ? domainName : `${domainName}${tld}`;
          return this.checkDomainAvailability(fullDomain);
        })
      );

      return results;
    } catch (error) {
      console.error('Error searching domains:', error);
      return [];
    }
  }

  // Log domain search for analytics
  async logDomainSearch(domain: string, userId?: string): Promise<void> {
    try {
      // You could store domain searches in a table for analytics
      // await supabase.from('domain_searches').insert({
      //   domain,
      //   user_id: userId,
      //   searched_at: new Date().toISOString()
      // });
      
      console.log(`Domain search logged: ${domain}`);
    } catch (error) {
      console.error('Error logging domain search:', error);
    }
  }

  // Format domain name (remove www, convert to lowercase, etc.)
  formatDomainName(input: string): string {
    return input
      .toLowerCase()
      .replace(/^www\./, '')
      .replace(/[^a-z0-9.-]/g, '')
      .trim();
  }

  // Validate domain name format
  isValidDomainName(domain: string): boolean {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    return domainRegex.test(domain);
  }
}

export const domainService = new DomainService();