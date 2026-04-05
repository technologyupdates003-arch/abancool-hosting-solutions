import { useState, useCallback } from 'react';
import { domainService, DomainSearchResult } from '@/services/domainService';

export const useDomainSearch = () => {
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDomain = useCallback(async (domainName: string, tlds?: string[]) => {
    if (!domainName.trim()) {
      setError('Please enter a domain name');
      return;
    }

    const formattedDomain = domainService.formatDomainName(domainName);
    
    if (!formattedDomain) {
      setError('Please enter a valid domain name');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const searchResults = await domainService.searchDomain(formattedDomain, tlds);
      setResults(searchResults);
      
      // Log the search for analytics
      await domainService.logDomainSearch(formattedDomain);
    } catch (err) {
      setError('Failed to search domain. Please try again.');
      console.error('Domain search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSingleDomain = useCallback(async (domain: string) => {
    if (!domain.trim()) {
      setError('Please enter a domain name');
      return null;
    }

    const formattedDomain = domainService.formatDomainName(domain);
    
    if (!domainService.isValidDomainName(formattedDomain)) {
      setError('Please enter a valid domain name');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await domainService.checkDomainAvailability(formattedDomain);
      
      // Log the search for analytics
      await domainService.logDomainSearch(formattedDomain);
      
      return result;
    } catch (err) {
      setError('Failed to check domain availability. Please try again.');
      console.error('Domain check error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchDomain,
    checkSingleDomain,
    clearResults
  };
};