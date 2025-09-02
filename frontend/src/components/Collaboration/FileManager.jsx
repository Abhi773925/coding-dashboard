import React, { useState, useRef } from 'react';
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  Plus, 
  Upload, 
  Download, 
  Trash2, 
  Edit3, 
  Copy, 
  Move, 
  MoreHorizontal,
  Search,
  Filter,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FileManager = ({ 
  files = [], 
  onFileSelect, 
  onFileCreate, 
  onFileDelete, 
  onFileRename, 
  onFileUpload, 
  onFolderCreate,
  selectedFile,
  canEdit = true 
}) => {
  const { isDarkMode } = useTheme();
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, item: null });
  const [draggedItem, setDraggedItem] = useState(null);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPath, setNewItemPath] = useState('/');
  const fileInputRef = useRef(null);

  // Build file tree structure
  const buildFileTree = (files) => {
    const tree = { 
      name: 'root', 
      type: 'folder', 
      path: '/', 
      children: [], 
      isRoot: true 
    };
    
    files.forEach(file => {
      const pathParts = file.path.split('/').filter(part => part);
      let currentNode = tree;
      
      // Navigate/create folder structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        let folder = currentNode.children.find(child => 
          child.name === folderName && child.type === 'folder'
        );
        
        if (!folder) {
          folder = {
            name: folderName,
            type: 'folder',
            path: '/' + pathParts.slice(0, i + 1).join('/'),
            children: []
          };
          currentNode.children.push(folder);
        }
        currentNode = folder;
      }
      
      // Add the file
      currentNode.children.push({
        ...file,
        name: pathParts[pathParts.length - 1] || file.name
      });
    });

    // Sort children (folders first, then files, both alphabetically)
    const sortChildren = (node) => {
      if (node.children) {
        node.children.sort((a, b) => {
          if (a.type === 'folder' && b.type !== 'folder') return -1;
          if (a.type !== 'folder' && b.type === 'folder') return 1;
          return a.name.localeCompare(b.name);
        });
        node.children.forEach(sortChildren);
      }
    };
    
    sortChildren(tree);
    return tree;
  };

  const fileTree = buildFileTree(files);

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  const handleRename = (item) => {
    const newName = prompt('Enter new name:', item.name);
    if (newName && newName !== item.name && onFileRename) {
      onFileRename(item, newName);
    }
    hideContextMenu();
  };

  const handleDelete = (item) => {
    if (confirm(`Delete ${item.name}?`) && onFileDelete) {
      onFileDelete(item);
    }
    hideContextMenu();
  };

  const handleDuplicate = (item) => {
    const newName = `${item.name.split('.')[0]}_copy.${item.name.split('.')[1] || 'txt'}`;
    if (onFileCreate) {
      onFileCreate(newName, item.content || '', item.path.replace(item.name, ''));
    }
    hideContextMenu();
  };

  const handleCreateFile = () => {
    if (newItemName && onFileCreate) {
      onFileCreate(newItemName, '', newItemPath);
      setNewItemName('');
      setShowNewFileModal(false);
    }
  };

  const handleCreateFolder = () => {
    if (newItemName && onFolderCreate) {
      onFolderCreate(newItemName, newItemPath);
      setNewItemName('');
      setShowNewFolderModal(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && onFileUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onFileUpload(file.name, event.target.result, '/');
      };
      reader.readAsText(file);
    }
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetFolder) => {
    e.preventDefault();
    if (draggedItem && targetFolder.type === 'folder' && onFileRename) {
      const newPath = `${targetFolder.path}/${draggedItem.name}`;
      onFileRename(draggedItem, draggedItem.name, newPath);
    }
    setDraggedItem(null);
  };

  const getFileIcon = (item) => {
    if (item.type === 'folder') {
      return expandedFolders.has(item.path) ? 
        <FolderOpen className="w-4 h-4 text-blue-500" /> : 
        <Folder className="w-4 h-4 text-blue-500" />;
    }

    const extension = item.name.split('.').pop()?.toLowerCase();
    const iconMap = {
      'js': '🟨',
      'jsx': '⚛️',
      'ts': '🔷',
      'tsx': '⚛️',
      'py': '🐍',
      'java': '☕',
      'cpp': '⚡',
      'c': '⚡',
      'html': '🌐',
      'css': '🎨',
      'json': '📋',
      'md': '📝',
      'txt': '📄'
    };

    return <span className="w-4 h-4 text-center">{iconMap[extension] || '📄'}</span>;
  };

  const renderTreeNode = (node, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFile?.path === node.path;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center px-2 py-1 cursor-pointer rounded transition-colors ${
            isSelected 
              ? isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
              : isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.path);
            } else {
              onFileSelect?.(node);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, node)}
          draggable={canEdit && !node.isRoot}
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node)}
        >
          {node.type === 'folder' && !node.isRoot && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder(node.path);
              }}
              className="mr-1"
            >
              {isExpanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
              }
            </button>
          )}
          
          <div className="mr-2">
            {getFileIcon(node)}
          </div>
          
          <span className={`text-sm truncate ${
            isDarkMode ? 'text-slate-300' : 'text-gray-900'
          }`}>
            {node.isRoot ? 'Workspace' : node.name}
          </span>
          
          {node.type === 'file' && node.language && (
            <span className={`ml-auto text-xs px-1 py-0.5 rounded ${
              isDarkMode ? 'bg-zinc-900 text-gray-300' : 'bg-gray-200 text-gray-600'
            }`}>
              {node.language}
            </span>
          )}
        </div>

        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'files' && file.type === 'file') ||
                         (filterType === 'folders' && file.type === 'folder');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
            File Explorer
          </h3>
          
          {canEdit && (
            <div className="flex space-x-1">
              <button
                onClick={() => setShowNewFileModal(true)}
                className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
                title="New File"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
                title="New Folder"
              >
                <Folder className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`p-1 rounded ${isDarkMode ? 'hover:bg-zinc-900' : 'hover:bg-gray-200'}`}
                title="Upload File"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-7 pr-3 py-1.5 text-sm rounded border ${
              isDarkMode 
                ? 'bg-zinc-900 border-gray-600 text-slate-300 placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:ring-1 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-auto p-2">
        {renderTreeNode(fileTree)}
      </div>

      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className={`fixed z-50 py-1 rounded-lg shadow-lg border ${
            isDarkMode ? 'bg-zinc-900 border-gray-700' : 'bg-white border-gray-200'
          }`}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={hideContextMenu}
        >
          {contextMenu.item && !contextMenu.item.isRoot && canEdit && (
            <>
              <button
                onClick={() => handleRename(contextMenu.item)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-900 flex items-center space-x-2`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Rename</span>
              </button>
              <button
                onClick={() => handleDuplicate(contextMenu.item)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-zinc-900 flex items-center space-x-2`}
              >
                <Copy className="w-3 h-3" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => handleDelete(contextMenu.item)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-red-600 text-red-500 hover:text-slate-300 flex items-center space-x-2`}
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* New File Modal */}
      {showNewFileModal && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-4 w-full max-w-sm ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}>
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Create New File
            </h3>
            <input
              type="text"
              placeholder="File name (e.g., main.js)"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className={`w-full px-3 py-2 rounded border mb-3 ${
                isDarkMode 
                  ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className={`flex-1 px-3 py-2 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-zinc-900 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFile}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-lg p-4 w-full max-w-sm ${
            isDarkMode ? 'bg-zinc-900' : 'bg-white'
          }`}>
            <h3 className={`font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
              Create New Folder
            </h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className={`w-full px-3 py-2 rounded border mb-3 ${
                isDarkMode 
                  ? 'bg-zinc-900 border-gray-600 text-slate-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className={`flex-1 px-3 py-2 rounded text-sm ${
                  isDarkMode 
                    ? 'bg-zinc-900 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-slate-300 rounded text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close context menu */}
      {contextMenu.visible && (
        <div
          className="fixed inset-0 z-40"
          onClick={hideContextMenu}
        />
      )}
    </div>
  );
};

export default FileManager;
