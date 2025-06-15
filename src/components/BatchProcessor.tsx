
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Trash2, X, Search, Filter, CheckSquare, Square, Eye, ExternalLink } from 'lucide-react';
import { detectContentType, optimizeText } from '@/utils/smartOptimization';
import QRCode from 'qrcode';

interface BatchItem {
  id: string;
  content: string;
  type: string;
  optimized: { optimized: string; saved: number };
  filename: string;
  qrDataURL?: string;
  selected: boolean;
}

function parseBatchContent(input: string): BatchItem[] {
  const items: BatchItem[] = [];
  
  // Split by common delimiters
  const lines = input.split(/[\n,;]/).map(line => line.trim()).filter(Boolean);
  
  // Smart detection of different content types
  lines.forEach((line, index) => {
    const contentType = detectContentType(line);
    const optimized = optimizeText(line);
    items.push({
      id: `item-${index}-${Date.now()}`,
      content: line,
      type: contentType,
      optimized,
      filename: generateFilename(line, contentType, index),
      selected: true
    });
  });
  
  return items;
}

function generateFilename(content: string, type: string, index: number): string {
  const timestamp = Date.now();
  const cleanContent = content.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  return `qrthis-${type}-${cleanContent || index}-${timestamp}.png`;
}

interface BatchTableProps {
  items: BatchItem[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRemoveItem: (id: string) => void;
  onPreviewItem: (item: BatchItem) => void;
  searchQuery: string;
  typeFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

function BatchTable({ 
  items, 
  onToggleSelect, 
  onToggleSelectAll, 
  onRemoveItem, 
  onPreviewItem,
  searchQuery,
  typeFilter,
  currentPage,
  itemsPerPage
}: BatchTableProps) {
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [items, searchQuery, typeFilter]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const selectedCount = items.filter(item => item.selected).length;
  const allSelected = selectedCount === items.length && items.length > 0;
  const someSelected = selectedCount > 0 && selectedCount < items.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSelectAll}
            className="flex items-center gap-2"
          >
            {allSelected ? <CheckSquare size={16} /> : someSelected ? <Square size={16} className="opacity-50" /> : <Square size={16} />}
            {selectedCount > 0 ? `${selectedCount} selected` : 'Select all'}
          </Button>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredItems.length} of {items.length} items
        </div>
      </div>

      <ScrollArea className="h-96 border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Select</TableHead>
              <TableHead className="w-20">Type</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleSelect(item.id)}
                    className="w-8 h-8 p-0"
                  >
                    {item.selected ? <CheckSquare size={16} /> : <Square size={16} />}
                  </Button>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {item.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-md">
                      {item.optimized.optimized || item.content}
                    </p>
                    {item.optimized.saved > 0 && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Optimized (-{item.optimized.saved} chars)
                      </p>
                    )}
                    {item.content !== (item.optimized.optimized || item.content) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md">
                        Original: {item.content}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {item.qrDataURL ? (
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                      Generated
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                      Pending
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPreviewItem(item)}
                      className="w-8 h-8 p-0"
                      title="Preview"
                    >
                      <Eye size={14} />
                    </Button>
                    {item.type === 'url' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(item.content, '_blank')}
                        className="w-8 h-8 p-0"
                        title="Visit URL"
                      >
                        <ExternalLink size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                      title="Remove"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

interface BatchControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  availableTypes: string[];
  selectedCount: number;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onGenerateSelected: () => void;
  onDownloadSelected: () => void;
  onClearAll: () => void;
  isGenerating: boolean;
}

function BatchControls({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  availableTypes,
  selectedCount,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onGenerateSelected,
  onDownloadSelected,
  onClearAll,
  isGenerating
}: BatchControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search content or type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white dark:bg-gray-900"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white dark:bg-gray-900"
          >
            <option value="all">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={onGenerateSelected}
            disabled={selectedCount === 0 || isGenerating}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isGenerating ? 'Generating...' : `Generate ${selectedCount} QR Codes`}
          </Button>
          <Button
            onClick={onDownloadSelected}
            disabled={selectedCount === 0}
            variant="outline"
          >
            <Download size={16} className="mr-1" />
            Download Selected
          </Button>
          <Button
            onClick={onClearAll}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} className="mr-1" />
            Clear All
          </Button>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface BatchProcessorProps {
  onBatchGenerate: (items: BatchItem[]) => void;
}

export function BatchProcessor({ onBatchGenerate }: BatchProcessorProps) {
  const [batchInput, setBatchInput] = useState('');
  const [parsedItems, setParsedItems] = useState<BatchItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewItem, setPreviewItem] = useState<BatchItem | null>(null);
  
  const itemsPerPage = 50;

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(parsedItems.map(item => item.type)));
    return types.sort();
  }, [parsedItems]);

  const selectedItems = useMemo(() => {
    return parsedItems.filter(item => item.selected);
  }, [parsedItems]);

  const totalPages = Math.ceil(parsedItems.length / itemsPerPage);

  const handleParse = useCallback(() => {
    const items = parseBatchContent(batchInput);
    setParsedItems(items);
    setCurrentPage(1);
  }, [batchInput]);

  const handleToggleSelect = useCallback((id: string) => {
    setParsedItems(prev => prev.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    const allSelected = parsedItems.every(item => item.selected);
    setParsedItems(prev => prev.map(item => ({ ...item, selected: !allSelected })));
  }, [parsedItems]);

  const handleRemoveItem = useCallback((id: string) => {
    setParsedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handlePreviewItem = useCallback((item: BatchItem) => {
    setPreviewItem(item);
  }, []);

  const handleClearAll = useCallback(() => {
    setParsedItems([]);
    setBatchInput('');
    setSearchQuery('');
    setTypeFilter('all');
    setCurrentPage(1);
  }, []);

  const handleGenerateSelected = useCallback(async () => {
    const itemsToGenerate = selectedItems;
    if (itemsToGenerate.length === 0) return;

    setIsGenerating(true);
    try {
      const itemsWithQR = await Promise.all(
        itemsToGenerate.map(async (item) => {
          const qrDataURL = await QRCode.toDataURL(item.optimized.optimized || item.content, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            width: 512
          });
          return { ...item, qrDataURL };
        })
      );
      
      // Update the items with QR codes
      setParsedItems(prev => prev.map(item => {
        const updated = itemsWithQR.find(generated => generated.id === item.id);
        return updated || item;
      }));
      
      onBatchGenerate(itemsWithQR);
    } catch (error) {
      console.error('Batch generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedItems, onBatchGenerate]);

  const handleDownloadSelected = useCallback(() => {
    const itemsToDownload = selectedItems.filter(item => item.qrDataURL);
    itemsToDownload.forEach((item) => {
      if (item.qrDataURL) {
        const link = document.createElement('a');
        link.download = item.filename;
        link.href = item.qrDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }, [selectedItems]);

  const detectedCount = batchInput.split(/[\n,;]/).filter(Boolean).length;

  return (
    <Card className="mt-6 border-t-4 border-t-green-500">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <h3 className="font-semibold text-lg">Smart Batch Processing</h3>
            </div>
            {batchInput && (
              <Button
                onClick={() => setBatchInput('')}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            <textarea
              placeholder="Paste multiple URLs, emails, or text items (one per line, separated by commas, or semicolons)...&#10;&#10;Example:&#10;https://example.com&#10;contact@company.com&#10;+1-555-123-4567"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              className="w-full h-32 p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {detectedCount} items detected
              </span>
              <Button 
                onClick={handleParse} 
                disabled={!batchInput.trim() || detectedCount === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Parse Items ({detectedCount})
              </Button>
            </div>
          </div>
          
          {parsedItems.length > 0 && (
            <div className="space-y-4">
              <BatchControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                availableTypes={availableTypes}
                selectedCount={selectedItems.length}
                totalCount={parsedItems.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onGenerateSelected={handleGenerateSelected}
                onDownloadSelected={handleDownloadSelected}
                onClearAll={handleClearAll}
                isGenerating={isGenerating}
              />
              
              <BatchTable
                items={parsedItems}
                onToggleSelect={handleToggleSelect}
                onToggleSelectAll={handleToggleSelectAll}
                onRemoveItem={handleRemoveItem}
                onPreviewItem={handlePreviewItem}
                searchQuery={searchQuery}
                typeFilter={typeFilter}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            </div>
          )}

          {/* Preview Modal */}
          {previewItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Preview</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewItem(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</label>
                    <p className="text-sm">{previewItem.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Content</label>
                    <p className="text-sm break-all">{previewItem.content}</p>
                  </div>
                  {previewItem.optimized.saved > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Optimized</label>
                      <p className="text-sm break-all">{previewItem.optimized.optimized}</p>
                      <p className="text-xs text-green-600">Saved {previewItem.optimized.saved} characters</p>
                    </div>
                  )}
                  {previewItem.qrDataURL && (
                    <div className="text-center">
                      <img 
                        src={previewItem.qrDataURL} 
                        alt="QR Code Preview"
                        className="w-32 h-32 mx-auto border rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
