import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TreeView, StackNode } from './TreeView';

expect.extend(toHaveNoViolations);

const mockResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.ResizeObserver = mockResizeObserver;

const renderInDarkMode = (ui: React.ReactElement) => {
  document.documentElement.classList.add('dark');
  const result = render(ui);
  return result;
};

describe('TreeView', () => {
  const mockData: StackNode = {
    id: 'root',
    name: 'Client Stack',
    children: [
      {
        id: 'security',
        name: 'Security',
        children: [
          {
            id: 'firewall',
            name: 'NextGen Firewall',
            value: 'Palo Alto'
          }
        ]
      },
      {
        id: 'network',
        name: 'Network',
        value: 'Cisco'
      }
    ]
  };

  const mockOnNodeSelect = jest.fn();
  const mockOnNodeToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tree structure correctly', () => {
    render(<TreeView data={mockData} />);
    
    // Check root node
    expect(screen.getByText('Client Stack')).toBeInTheDocument();
    
    // Check first level nodes
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Cisco')).toBeInTheDocument();
  });

  it('expands nodes on click', () => {
    render(
      <TreeView 
        data={mockData} 
        onNodeToggle={mockOnNodeToggle}
      />
    );

    // Click to expand Security node
    const expandIcon = screen.getByTestId('ChevronRightIcon');
    fireEvent.click(expandIcon);

    // Verify callback was called
    expect(mockOnNodeToggle).toHaveBeenCalled();
  });

  it('calls onNodeSelect when a node is selected', () => {
    render(
      <TreeView 
        data={mockData} 
        onNodeSelect={mockOnNodeSelect}
      />
    );

    // Click on Network node
    fireEvent.click(screen.getByText('Network'));

    // Verify callback was called with correct node id
    expect(mockOnNodeSelect).toHaveBeenCalledWith('network');
  });

  it('displays node values when provided', () => {
    render(<TreeView data={mockData} />);
    
    // Check if values are displayed
    expect(screen.getByText('Cisco')).toBeInTheDocument();
    
    // Expand Security to see Palo Alto
    const expandIcon = screen.getByTestId('ChevronRightIcon');
    fireEvent.click(expandIcon);
    expect(screen.getByText('Palo Alto')).toBeInTheDocument();
  });

  it('supports mobile interaction', async () => {
    const onSelect = jest.fn();
    render(<TreeView data={mockData} onNodeSelect={onSelect} />);

    // Find and expand security node
    const expandIcon = screen.getByTestId('ChevronRightIcon');
    await act(async () => {
      fireEvent.click(expandIcon);
    });

    // Verify node expands and shows child
    expect(screen.getByText('Palo Alto')).toBeInTheDocument();

    // Test node selection
    const securityNode = screen.getByText('Security');
    await act(async () => {
      fireEvent.click(securityNode);
    });

    // Verify selection
    expect(onSelect).toHaveBeenCalledWith('security');
  });

  it('renders correctly in dark mode', async () => {
    renderInDarkMode(<TreeView data={mockData} />);
    
    // Wait for dark mode styles to apply
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Check dark mode styles
    const treeItems = screen.getAllByRole('treeitem');
    treeItems.forEach(item => {
      const styles = window.getComputedStyle(item);
      expect(styles.color).not.toBe('rgb(0, 0, 0)'); // Should not be black in dark mode
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TreeView data={mockData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports dark mode', async () => {
    document.documentElement.classList.add('dark');
    const { container } = render(<TreeView data={mockData} />);
    
    // Wait for styles to be applied
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify dark mode styles
    const treeRoot = container.querySelector('.MuiTreeView-root');
    expect(treeRoot).toHaveClass('dark');
    
    // Clean up
    document.documentElement.classList.remove('dark');
  });

  it('meets accessibility standards', async () => {
    const { container } = render(<TreeView data={mockData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports node selection', async () => {
    const onSelect = jest.fn();
    render(<TreeView data={mockData} onNodeSelect={onSelect} />);
    
    // Find security node
    const securityNode = screen.getByText('Security');
    expect(securityNode).toBeVisible();

    // Click the node
    await act(async () => {
      fireEvent.click(securityNode);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify node was selected
    expect(onSelect).toHaveBeenCalledWith('security');
  });

  it('handles invalid data gracefully', async () => {
    const invalidData = null as unknown as StackNode;
    await act(async () => {
      render(<TreeView data={invalidData} />);
    });
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles empty children arrays', () => {
    const emptyData = {
      id: 'root',
      name: 'Empty Stack',
      children: []
    };
    render(<TreeView data={emptyData} />);
    expect(screen.getByText('Empty Stack')).toBeInTheDocument();
  });

  it('maintains performance with large datasets', async () => {
    // Create a large dataset with collapsed nodes
    const largeData = {
      id: 'root',
      name: 'Large Stack',
      children: Array.from({ length: 100 }, (_, i) => ({
        id: `node-${i}`,
        name: `Node ${i}`,
        value: `Value ${i}`,
        children: Array.from({ length: 5 }, (_, j) => ({
          id: `node-${i}-${j}`,
          name: `Subnode ${j}`,
          value: `Value ${i}.${j}`
        }))
      }))
    };

    // Measure initial render time
    const start = performance.now();
    await act(async () => {
      render(
        <TreeView 
          data={largeData} 
          defaultExpanded={[]} // Start with all nodes collapsed
        />
      );
    });
    const end = performance.now();

    // Verify render time is reasonable
    expect(end - start).toBeLessThan(500); // 500ms is a reasonable threshold

    // Verify only root node is rendered initially
    const rootNode = screen.getByText('Large Stack');
    expect(rootNode).toBeInTheDocument();
    expect(screen.queryByText('Node 0')).not.toBeInTheDocument();

    // Expand root node
    const expandIcon = screen.getByTestId('ChevronRightIcon');
    await act(async () => {
      fireEvent.click(expandIcon);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verify first level nodes are rendered
    expect(screen.getByText('Node 0')).toBeInTheDocument();
    expect(screen.queryByText('Subnode 0')).not.toBeInTheDocument();
  });
});
