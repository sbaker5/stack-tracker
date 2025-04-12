import React from 'react';
import { render, screen, within, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportMenu } from './ExportMenu';

describe('ExportMenu', () => {
  const mockOnExport = jest.fn().mockImplementation(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders export button with tooltip', () => {
    render(<ExportMenu onExport={mockOnExport} />);
    
    const button = screen.getByRole('button', { name: /export options/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('shows menu on button click', async () => {
    const user = userEvent.setup();
    render(<ExportMenu onExport={mockOnExport} />);
    
    // Click export button
    const button = screen.getByTestId('export-button');
    await user.click(button);

    // Verify menu is shown with default options
    const menu = screen.getByTestId('export-menu');
    expect(menu).toBeInTheDocument();

    // Verify all default options are present
    expect(screen.getByText('Mind Map (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Tiered List (PDF)')).toBeInTheDocument();
    expect(screen.getByText('Data Table (CSV)')).toBeInTheDocument();
  });

  it('calls onExport with correct format when option selected', async () => {
    const user = userEvent.setup();
    render(<ExportMenu onExport={mockOnExport} />);
    
    // Open menu
    await user.click(screen.getByTestId('export-button'));

    // Click mind map option
    const mindMapOption = screen.getByTestId('export-option-mindmap-pdf');
    await user.click(mindMapOption);

    // Verify export was triggered
    expect(mockOnExport).toHaveBeenCalledWith('mindmap-pdf');
  });

  it('disables button when disabled prop is true', () => {
    render(<ExportMenu onExport={mockOnExport} disabled />);
    
    const button = screen.getByTestId('export-button');
    expect(button).toBeDisabled();
  });

  it('shows loading state during export', async () => {
    // Mock a delayed export
    const delayedExport = jest.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    render(<ExportMenu onExport={delayedExport} />);
    
    // Open menu and click option
    await user.click(screen.getByTestId('export-button'));
    const option = screen.getByTestId('export-option-mindmap-pdf');
    
    // Start export
    await act(async () => {
      await user.click(option);
    });

    // Verify button is disabled during export
    expect(screen.getByTestId('export-button')).toBeDisabled();

    // Wait for export to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Verify button is re-enabled
    expect(screen.getByTestId('export-button')).toBeEnabled();
  });

  it('supports custom export formats', async () => {
    const customFormats = [
      {
        id: 'custom-format',
        label: 'Custom Format',
        icon: <div>Icon</div>,
        description: 'Custom export format'
      }
    ];

    const user = userEvent.setup();
    render(
      <ExportMenu 
        onExport={mockOnExport} 
        availableFormats={customFormats}
      />
    );
    
    // Open menu
    await user.click(screen.getByTestId('export-button'));

    // Verify custom format is shown
    expect(screen.getByText('Custom Format')).toBeInTheDocument();
    expect(screen.getByText('Custom export format')).toBeInTheDocument();

    // Verify default formats are not shown
    expect(screen.queryByText('Mind Map (PDF)')).not.toBeInTheDocument();
  });

  it('handles export errors gracefully', async () => {
    const failedExport = jest.fn().mockRejectedValue(new Error('Export failed'));
    
    const user = userEvent.setup();
    render(<ExportMenu onExport={failedExport} />);
    
    // Open menu and click option
    await user.click(screen.getByTestId('export-button'));
    const option = screen.getByTestId('export-option-mindmap-pdf');
    
    // Attempt export
    await act(async () => {
      await user.click(option);
    });

    // Verify button is re-enabled after error
    expect(screen.getByTestId('export-button')).toBeEnabled();
  });

  it('closes menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(<ExportMenu onExport={mockOnExport} />);
    
    // Open menu
    await user.click(screen.getByTestId('export-button'));
    expect(screen.getByTestId('export-menu')).toBeInTheDocument();

    // Click outside menu
    await act(async () => {
      fireEvent.click(document.body);
    });

    // Verify menu is closed
    expect(screen.queryByTestId('export-menu')).not.toBeInTheDocument();
  });
});
