import React from 'react';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { TreeView as MuiTreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styled } from '@mui/material/styles';

export interface StackNode {
  id: string;
  name: string;
  children?: StackNode[];
  value?: string;
}

export interface TreeViewProps {
  data: StackNode;
  onNodeSelect?: (nodeId: string) => void;
  onNodeToggle?: (nodeIds: string[]) => void;
  editable?: boolean;
  defaultExpanded?: string[];
}

const renderTree = (node: StackNode, editable: boolean) => (
  <TreeItem
    key={node.id}
    nodeId={node.id}
    label={
      <div className="flex justify-between items-center py-1">
        <span>{node.name}</span>
        {node.value && <span className="text-gray-500 dark:text-gray-400">{node.value}</span>}
      </div>
    }
  >
    {Array.isArray(node.children)
      ? node.children.map((child) => renderTree(child, editable))
      : null}
  </TreeItem>
);

const StyledTreeView = styled(MuiTreeView)(({ theme }) => ({
  '&.dark': {
    color: '#fff',
    backgroundColor: '#1a1a1a',
    '& .MuiTreeItem-content': {
      color: '#fff'
    }
  }
}));

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeSelect,
  onNodeToggle,
  editable = false,
  defaultExpanded,
}) => {
  if (!data) {
    return <div>No data available</div>;
  }
  return (
    <StyledTreeView
      aria-label="client stack tree"
      defaultCollapseIcon={<ExpandMoreIcon data-testid="ExpandMoreIcon" />}
      defaultExpandIcon={<ChevronRightIcon data-testid="ChevronRightIcon" />}
      onNodeSelect={(event: React.SyntheticEvent, nodeIds: string | string[]) => {
        if (typeof nodeIds === 'string') {
          onNodeSelect?.(nodeIds);
        }
      }}
      onNodeToggle={(event: React.SyntheticEvent, nodeIds: string[]) => {
        onNodeToggle?.(nodeIds);
      }}
      className={`w-full ${document.documentElement.classList.contains('dark') ? 'dark' : ''}`}
      defaultExpanded={defaultExpanded ?? [data.id]}
      role="tree"
    >
      {renderTree(data, editable)}
    </StyledTreeView>
  );
};
