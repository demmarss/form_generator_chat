import React, { useState } from 'react';
import { Form } from '../../types';
import { Copy, Check, Download } from 'lucide-react';

interface CodeViewerProps {
  form: Form | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ form }) => {
  const [activeTab, setActiveTab] = useState<'json' | 'react' | 'html'>('json');
  const [copied, setCopied] = useState(false);

  if (!form) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <p className="text-gray-500">No form selected</p>
      </div>
    );
  }

  const generateJsonCode = () => {
    return JSON.stringify(form, null, 2);
  };

  const generateReactCode = () => {
    const imports = `import React, { useState } from 'react';
import * as yup from 'yup';

const ${form.title.replace(/\s+/g, '')}Form = () => {`;

    const stateDeclaration = `  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };`;

    const renderMethod = `
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">${form.title}</h1>
        ${form.subtitle ? `<p className="text-lg text-gray-600 mb-4">${form.subtitle}</p>` : ''}
        
        <div className="space-y-6">`;

    let elementsCode = '';
    form.pages.forEach(page => {
      page.sections.forEach(section => {
        section.rows.forEach(row => {
          row.elements.forEach(element => {
            switch (element.type) {
              case 'text':
              case 'email':
              case 'tel':
                elementsCode += `
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              ${element.label}${element.required ? ' *' : ''}
            </label>
            <input
              type="${element.type}"
              name="${element.name}"
              placeholder="${element.placeholder || ''}"
              value={formData.${element.name} || ''}
              onChange={(e) => handleInputChange('${element.name}', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              ${element.required ? 'required' : ''}
            />
          </div>`;
                break;
              case 'textarea':
                elementsCode += `
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              ${element.label}${element.required ? ' *' : ''}
            </label>
            <textarea
              name="${element.name}"
              placeholder="${element.placeholder || ''}"
              value={formData.${element.name} || ''}
              onChange={(e) => handleInputChange('${element.name}', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              rows={4}
              ${element.required ? 'required' : ''}
            />
          </div>`;
                break;
            }
          });
        });
      });
    });

    const submitButton = `
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default ${form.title.replace(/\s+/g, '')}Form;`;

    return imports + stateDeclaration + renderMethod + elementsCode + submitButton;
  };

  const generateHtmlCode = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${form.title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
  <div class="max-w-2xl mx-auto p-6">
    <form class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">${form.title}</h1>`;

    if (form.subtitle) {
      html += `\n      <p class="text-lg text-gray-600 mb-4">${form.subtitle}</p>`;
    }

    html += `\n      \n      <div class="space-y-6">`;

    form.pages.forEach(page => {
      page.sections.forEach(section => {
        section.rows.forEach(row => {
          row.elements.forEach(element => {
            switch (element.type) {
              case 'text':
              case 'email':
              case 'tel':
                html += `
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">
            ${element.label}${element.required ? ' *' : ''}
          </label>
          <input
            type="${element.type}"
            name="${element.name}"
            placeholder="${element.placeholder || ''}"
            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            ${element.required ? 'required' : ''}
          />
        </div>`;
                break;
              case 'textarea':
                html += `
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">
            ${element.label}${element.required ? ' *' : ''}
          </label>
          <textarea
            name="${element.name}"
            placeholder="${element.placeholder || ''}"
            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            rows="4"
            ${element.required ? 'required' : ''}
          ></textarea>
        </div>`;
                break;
            }
          });
        });
      });
    });

    html += `
      </div>
      
      <div class="mt-6">
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</body>
</html>`;

    return html;
  };

  const getCodeContent = () => {
    switch (activeTab) {
      case 'json':
        return generateJsonCode();
      case 'react':
        return generateReactCode();
      case 'html':
        return generateHtmlCode();
      default:
        return '';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getCodeContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadCode = () => {
    const content = getCodeContent();
    const extension = activeTab === 'json' ? 'json' : activeTab === 'react' ? 'jsx' : 'html';
    const filename = `${form.title.replace(/\s+/g, '_').toLowerCase()}_form.${extension}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex space-x-1">
          {(['json', 'react', 'html'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-blue-100 text-blue-700 border-blue-300'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          
          <button
            onClick={downloadCode}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm bg-gray-50 h-full overflow-auto">
          <code className="language-javascript">{getCodeContent()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;