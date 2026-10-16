import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type RequestStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'BIDDING'
  | 'BIDS_VIEWABLE'
  | 'MECHANIC_SELECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'UNDER_REVIEW';

export interface RequestFilterState {
  status: RequestStatus | 'ALL';
  dateFrom: Date | null;
  dateTo: Date | null;
  search: string;
}

interface RequestFiltersProps {
  onFilterChange: (filters: RequestFilterState) => void;
}

export const RequestFilters: React.FC<RequestFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<RequestFilterState>({
    status: 'ALL',
    dateFrom: null,
    dateTo: null,
    search: '',
  });

  const updateFilters = (newUpdate: Partial<RequestFilterState>) => {
    const updated = { ...filters, ...newUpdate } as RequestFilterState;
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleClear = () => {
    const reset: RequestFilterState = {
      status: 'ALL',
      dateFrom: null,
      dateTo: null,
      search: '',
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customer, brand, or model..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-9 h-10"
          />
        </div>

        {/* Status Dropdown */}
        <div>
          <Select
            value={filters.status}
            onValueChange={(val) => updateFilters({ status: val as RequestStatus | 'ALL' })}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="UNDER_REVIEW">⚠️ Needs Review (&lt; 3 Bids)</SelectItem>
              <SelectItem value="PENDING">Pending Review</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="BIDDING">Bidding Open</SelectItem>
              <SelectItem value="BIDS_VIEWABLE">Bids Viewable</SelectItem>
              <SelectItem value="MECHANIC_SELECTED">Mechanic Selected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date From */}
        <div>
          <Input
            type="date"
            className="h-10 text-xs"
            value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              updateFilters({ dateFrom: e.target.value ? new Date(e.target.value) : null })
            }
          />
        </div>

        {/* Clear Filter Button */}
        <div className="flex gap-2">
          <Input
            type="date"
            className="h-10 text-xs"
            value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
            onChange={(e) =>
              updateFilters({ dateTo: e.target.value ? new Date(e.target.value) : null })
            }
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleClear}
            className="h-10 w-10 shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
};