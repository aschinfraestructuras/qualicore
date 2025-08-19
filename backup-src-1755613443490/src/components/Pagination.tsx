import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Informações sobre itens */}
      <div className="text-sm text-gray-600">
        Mostrando {startItem} a {endItem} de {totalItems} resultados
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center space-x-2">
        {/* Botão Anterior */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Anterior</span>
        </motion.button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <div
                  key={`dots-${index}`}
                  className="px-3 py-2 text-gray-400 flex items-center"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              );
            }

            const pageNumber = page as number;
            const isActive = pageNumber === currentPage;

            return (
              <motion.button
                key={pageNumber}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(pageNumber)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                }`}
              >
                {pageNumber}
              </motion.button>
            );
          })}
        </div>

        {/* Botão Próximo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center space-x-1 ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
          }`}
        >
          <span className="hidden sm:inline">Próximo</span>
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>
    </div>
  );
}
