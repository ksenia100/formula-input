import { useQuery } from 'react-query';

const fetchAutocompleteSuggestions = async () => {
  const response = await fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`);
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const useAutocomplete = () => {
  return useQuery('autocomplete', fetchAutocompleteSuggestions, {
    enabled: true,
  });
};