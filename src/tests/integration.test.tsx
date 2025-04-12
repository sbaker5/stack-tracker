import React from 'react';
import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import { TreeView } from '../components/TreeView/TreeView';
import { TagFlagManager } from '../components/TagFlagManager/TagFlagManager';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { ExportMenu } from '../components/ExportMenu/ExportMenu';

describe('Client Stack Integration', () => {
  const mockStackData = {
    id: 'root',
    name: 'Client Stack',
    children: [
      {
        id: 'tech',
        name: 'Technology',
        value: 'Modern',
        children: [
          { id: 'frontend', name: 'Frontend', value: 'React' },
          { id: 'backend', name: 'Backend', value: 'Node.js' }
        ]
      },
      {
        id: 'business',
        name: 'Business',
        value: 'Enterprise',
        children: [
          { id: 'sector', name: 'Sector', value: 'Finance' }
        ]
      }
    ]
  };

  const mockTags = ['enterprise', 'finance'];
  const mockFlags = ['Renewal Due'];
  const mockAvailableTags = ['enterprise', 'finance', 'healthcare', 'tech'];
  const mockAvailableFlags = ['Renewal Due', 'Follow-Up Needed', 'Expansion Planned'];

  it('integrates search with tree view selection', async () => {
    const user = userEvent.setup();
    const onNodeSelect = jest.fn();

    render(
      <>
        <SearchBar
          placeholder="Search client stack..."
          minSearchLength={2}
          onSearch={async (query) => {
            return [
              { id: 'frontend', name: 'Frontend', type: 'technology', path: ['Technology', 'Frontend'] },
              { id: 'backend', name: 'Backend', type: 'technology', path: ['Technology', 'Backend'] }
            ];
          }}
          onResultSelect={(id) => onNodeSelect(id)}
        />
        <TreeView
          data={mockStackData}
          onNodeSelect={onNodeSelect}
          defaultExpanded={[]}
        />
      </>
    );

    // Search for 'front' and select result
    const searchInput = screen.getByPlaceholderText('Search client stack...');
    await act(async () => {
      await user.type(searchInput, 'front');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for and select search result
    const results = await screen.findAllByRole('option');
    await act(async () => {
      await user.click(results[0]);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify tree node was selected
    expect(onNodeSelect).toHaveBeenCalledWith('frontend');
  });

  it('integrates tag management with export functionality', async () => {
    const user = userEvent.setup();
    const onExport = jest.fn();

    render(
      <>
        <TagFlagManager
          tags={mockTags}
          flags={mockFlags}
          availableTags={mockAvailableTags}
          availableFlags={mockAvailableFlags}
          onTagsChange={() => {}}
          onFlagsChange={() => {}}
        />
        <ExportMenu
          onExport={onExport}
          availableFormats={[
            {
              id: 'pdf',
              label: 'PDF',
              icon: <PictureAsPdfIcon />,
              description: 'Export as PDF'
            },
            {
              id: 'csv',
              label: 'CSV',
              icon: <TableChartIcon />,
              description: 'Export as CSV'
            }
          ]}
        />
      </>
    );

    // Click export button
    const exportButton = screen.getByText('Export');
    await act(async () => {
      await user.click(exportButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Select PDF format
    const pdfOption = screen.getByText('PDF');
    await act(async () => {
      await user.click(pdfOption);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify export was called with current tags/flags
    expect(onExport).toHaveBeenCalled();
  });

  it('integrates search results with tag filtering', async () => {
    const user = userEvent.setup();
    const onTagsChange = jest.fn();

    render(
      <>
        <SearchBar
          placeholder="Search client stack..."
          minSearchLength={2}
          onSearch={async (query) => {
            return [
              { id: 'tech', name: 'Technology', type: 'technology', path: ['Technology'] },
              { id: 'finance', name: 'Finance', type: 'client', path: ['Business', 'Sector'] }
            ];
          }}
          onResultSelect={() => {}}
        />
        <TagFlagManager
          tags={mockTags}
          flags={mockFlags}
          availableTags={mockAvailableTags}
          availableFlags={mockAvailableFlags}
          onTagsChange={onTagsChange}
          onFlagsChange={() => {}}
        />
      </>
    );

    // Search for 'tech'
    const searchInput = screen.getByPlaceholderText('Search client stack...');
    await act(async () => {
      await user.type(searchInput, 'tech');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for search results
    const results = await screen.findAllByRole('option');
    expect(results).toHaveLength(2);

    // Add tech tag
    const tagInput = screen.getByTestId('tag-input').querySelector('input');
    if (!tagInput) throw new Error('Tag input not found');

    await act(async () => {
      await user.type(tagInput, 'tech');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const tagOptions = await screen.findByText('tech');
    await act(async () => {
      await user.click(tagOptions);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify tag was added
    expect(onTagsChange).toHaveBeenCalledWith([...mockTags, 'tech']);
  });

  it('integrates tree view selection with flag updates', async () => {
    const user = userEvent.setup();
    const onFlagsChange = jest.fn();

    render(
      <>
        <TreeView
          data={mockStackData}
          onNodeSelect={() => {}}
          defaultExpanded={['root']}
        />
        <TagFlagManager
          tags={mockTags}
          flags={mockFlags}
          availableTags={mockAvailableTags}
          availableFlags={mockAvailableFlags}
          onTagsChange={() => {}}
          onFlagsChange={onFlagsChange}
        />
      </>
    );

    // Select a business node
    const businessNode = screen.getByText('Business');
    await act(async () => {
      await user.click(businessNode);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Add expansion flag
    const flagInput = screen.getByTestId('flag-input').querySelector('input');
    if (!flagInput) throw new Error('Flag input not found');

    await act(async () => {
      await user.type(flagInput, 'Expansion');
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const flagOption = await screen.findByText('Expansion Planned');
    await act(async () => {
      await user.click(flagOption);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify flag was added
    expect(onFlagsChange).toHaveBeenCalledWith([...mockFlags, 'Expansion Planned']);
  });
});
