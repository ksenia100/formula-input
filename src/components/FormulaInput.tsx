import React, { useState, useEffect } from 'react';
import { useFormulaInput } from '../hooks/useFormulaInput';
import { useAutocomplete } from '../hooks/fetchAutocompleteSuggestions';

const FormulaInput: React.FC = () => {
    const { formula, setFormula } = useFormulaInput();
    const [input, setInput] = useState('');
    const [variables, setVariables] = useState<{ [key: string]: number }>({});
    const [result, setResult] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string>('');
  
    const { data: suggestions, isLoading, error } = useAutocomplete();
  
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInput(value);
      setErrorText(''); 
    };
  
    const handleSuggestionClick = (suggestion: any) => {
      const newFormula = `${formula}${suggestion.name}`;
      setFormula(newFormula);
      setInput('');
      setVariables((prev) => ({ ...prev, [suggestion.name]: suggestion.value }));
    };
  
    const handleOperatorClick = (operator: string) => {
      setFormula(`${formula}${operator}`);
    };
  
    const handleTagClick = (tag: string) => {
      setFormula(formula.replace(tag, ''));
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const newTags = formula.split(/([+\-*/()^])/);
      newTags[index] = event.target.value;
      setFormula(newTags.join(''));
    };
  
    const calculateFormula = () => {
      try {
        const formulaWithValues = formula.replace(/([a-zA-Z]+\s*\d*)/g, (match) => {
          const variable = match.trim();
          if (variables.hasOwnProperty(variable)) {
            return variables[variable].toString();
          }
          throw new Error('Invalid formula');
        });
        const result = eval(formulaWithValues);
        setResult(`Result: ${result}`);
      } catch (error) {
        setResult('Invalid formula');
      }
    };
  
    const uniqueSuggestions = suggestions?.reduce((acc: any[], current: any) => {
      const found = acc.some((item) => item.id === current.id);
      if (!found) {
        acc.push(current);
      }
      return acc;
    }, []);
  
    const filteredSuggestions = uniqueSuggestions?.filter((suggestion: any) => {
      const suggestionName = suggestion.name.toLowerCase();
      const inputText = input.toLowerCase();
      return suggestionName.includes(inputText);
    });
  
    useEffect(() => {
      if (error) {
        setErrorText('Error fetching suggestions');
      }
    }, [error]);
  
    return (
        <div className="p-6 bg-gray-900 text-white rounded-lg shadow-md">
          <div className="mb-6">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Enter your formula"
              className="border border-gray-700 bg-gray-800 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white"
            />
            {isLoading && <p className="text-gray-400 mt-2">Loading suggestions...</p>}
            {errorText && <p className="text-red-500 mt-2">{errorText}</p>}
            {!isLoading && filteredSuggestions && filteredSuggestions.length === 0 && (
              <p className="text-red-500 mt-2">No suggestions found</p>
            )}
            {filteredSuggestions && filteredSuggestions.length > 0 && (
              <ul className="border border-gray-700 bg-gray-800 rounded-lg mt-2 max-h-40 overflow-y-auto shadow-lg">
                {filteredSuggestions.map((suggestion: any) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 hover:bg-gray-700 cursor-pointer"
                  >
                    {suggestion.name} ({suggestion.category})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {['+', '-', '*', '/', '(', ')', '^'].map((operator) => (
              <button
                type="button"
                key={operator}
                onClick={() => handleOperatorClick(operator)}
                className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-full hover:bg-indigo-500 hover:text-white transition duration-300"
              >
                {operator}
              </button>
            ))}
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {formula.split(/([+\-*/()^])/).map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(event) => handleInputChange(event, index)}
                  className="border border-gray-700 bg-gray-800 rounded-lg p-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-white"
                />
                {!['+', '-', '*', '/', '(', ')', '^'].includes(tag) && (
                  <button
                    onClick={() => handleTagClick(tag)}
                    className="border border-red-500 text-red-500 px-2 py-1 rounded-full hover:bg-red-500 hover:text-white transition duration-300"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={calculateFormula}
            className="border border-green-500 text-green-500 px-6 py-2 rounded-full hover:bg-green-500 hover:text-white transition duration-300"
          >
            Calculate
          </button>
          {result && <p className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">{result}</p>}
        </div>
      );
      
  };
  
  export default FormulaInput;