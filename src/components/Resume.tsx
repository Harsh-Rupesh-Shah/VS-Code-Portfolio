import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Download, ChevronLeft, ChevronRight, FileWarning, ZoomIn, ZoomOut } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../utils/cn';

// Set worker URL for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface ResumeProps {
  pdfUrl: string;
}

export const Resume: React.FC<ResumeProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useThemeStore();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(err: Error) {
    console.error('Error loading PDF:', err);
    setError('Could not load the resume PDF. Please try again later.');
  }

  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.7));
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        zoomIn();
      } else {
        zoomOut();
      }
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <FileWarning className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <p className="text-lg font-medium mb-2">{error}</p>
          <p className="text-sm opacity-75">
            Please ensure the resume PDF file is properly uploaded to the public directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div 
        className="flex justify-between items-center p-4 border-b"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "hover:bg-opacity-10 hover:bg-white",
              pageNumber <= 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span>
            Page {pageNumber} of {numPages || '--'}
          </span>
          <button
            onClick={nextPage}
            disabled={numPages === null || pageNumber >= numPages}
            className={cn(
              "p-2 rounded-lg transition-colors",
              "hover:bg-opacity-10 hover:bg-white",
              (numPages === null || pageNumber >= numPages) && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <a
            href={pdfUrl}
            download="resume.pdf"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-opacity-10 hover:bg-opacity-20 transition-colors",
              "bg-white"
            )}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </div>
      <div 
        className="flex-1 overflow-auto p-4 flex justify-center"
        onWheel={handleWheel}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center p-4">
              <div className="animate-pulse">Loading resume...</div>
            </div>
          }
          className="max-w-full"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            className="shadow-xl"
            scale={scale}
            loading={
              <div className="w-[800px] h-[1000px] bg-gray-100 animate-pulse rounded-lg" />
            }
          />
        </Document>
      </div>
    </div>
  );
};