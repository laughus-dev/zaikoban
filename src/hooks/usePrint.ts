import {useRef} from 'react';
import {useReactToPrint} from 'react-to-print';

interface UsePrintOptions {
    documentTitle?: string;
    pageSize?: 'A4' | 'A3' | 'Letter';
    margin?: string;
    additionalStyles?: string;
}

export const usePrint = (options: UsePrintOptions = {}) => {
    const printRef = useRef<HTMLDivElement>(null);

    const {
        documentTitle = 'ドキュメント',
        pageSize = 'A4',
        margin = '15mm',
        additionalStyles = ''
    } = options;

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle,
        pageStyle: `
      @page {
        size: ${pageSize};
        margin: ${margin};
      }
      @media print {
        body { 
          font-size: 10pt;
          line-height: 1.4;
        }
        button { 
          display: none !important; 
        }
        [role="tablist"] {
          display: none !important;
        }
        input, select {
          border: 1px solid #ccc !important;
          background: white !important;
        }
        ${additionalStyles}
      }
    `,
    });

    return {
        printRef,
        handlePrint
    };
};