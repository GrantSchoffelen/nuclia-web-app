"use client"
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [model, setModel] = useState<string>('chatgpt-azure');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resources, setResources] = useState<any[]>([]);

  const nucliaFindUrl = `https://aws-us-east-2-1.nuclia.cloud/api/v1/kb/3b486dc9-c540-464b-91df-3fd23c632069/find`

  const handleSearch = async (event: FormEvent) => {
    console.log("hello world")
    event.preventDefault();
    setIsLoading(true);
    const payload = {
      "query": userPrompt,
      "model": model,
      "features": [
        "paragraph",
        "vector",
        "relations"
      ],
      "highlight": true,
      "autofilter": false,
      "page_number": 0,
      "show": [
          "basic",
          "values",
          "origin"
      ],
    }
    try {
      const response = await axios.post(nucliaFindUrl, payload);
      // console.log(response.data.resources.map((resource: any) => console.log(resource.fields)));
      Object.values(resources).map((resource: any) => (
        console.log(resource, 'resource')
        // console.log(resource.fields)
      ))
      setResources(response.data.resources);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <form onSubmit={handleSearch} className="flex flex-col items-center">
          <input
            type="text"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Search..."
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          />
          <select
            value={model}
            onChange={handleModelChange}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          >
            <option value="chatgpt-azure">chatgpt-azure</option>
            <option value="chatgpt-azure-3">chatgpt-azure-3</option>
            <option value="gemini-pro">gemini-pro</option>
            <option value="claude-3-fast">claude-3-fast</option>
            <option value="chatgpt4">chatgpt4</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
            onClick={handleSearch}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </form>
        <div>
        {
        Object.values(resources).map((resource: any) => {
          return (
            <div key={resource.id} className="border border-gray-300 rounded-md p-4 mb-4 flex items-center">
              <img src={`https://aws-us-east-2-1.nuclia.cloud/api/v1${resource.thumbnail}`} alt="Thumbnail" width={300} className="mr-4"/>
              <div>
                <h2 className="text-xl font-bold">{resource.title}</h2>
                <p>{resource.title}</p>

                {resource.fields['/u/link'] && Object.values(resource.fields['/u/link'].paragraphs).map((paragraph: any) => {
                  return (
                    <li key={paragraph.id} className="border border-gray-300 rounded-md p-4 mb-4">
                      {paragraph.text}
                    </li>
                  );
                })}
              </div>
            </div>
          );
        })
        }
        </div>
      </main>
    );
}
