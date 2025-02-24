import React, { useState, useEffect, useRef } from 'react';

const MODULE_TYPES = {
  LINEAR: {
    label: 'Linear Layer',
    color: '#48bb78',
    radius: 45,
    description: 'Fully connected layer'
  },
  CONV: {
    label: 'Conv2D',
    color: '#4299e1',
    radius: 50,
    description: 'Convolutional layer'
  },
  ACTIVATION: {
    label: 'ReLU',
    color: '#ed64a6',
    radius: 40,
    description: 'Activation function'
  },
  ATTENTION: {
    label: 'Attention',
    color: '#9f7aea',
    radius: 55,
    description: 'Self-attention layer'
  }
};

// Connection line component
const ConnectionLine = ({ startNode, endNode }) => {
  const startX = startNode.x + startNode.radius;
  const startY = startNode.y + startNode.radius;
  const endX = endNode.x + endNode.radius;
  const endY = endNode.y + endNode.radius;

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="#94a3b8"
        strokeWidth="2"
        strokeDasharray="4"
      />
    </svg>
  );
};

const ModuleSelector = ({ onSelectModule }) => {
  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-64">
      <h3 className="text-lg font-semibold mb-4">Available Modules</h3>
      <div className="space-y-2">
        {Object.entries(MODULE_TYPES).map(([key, module]) => (
          <div
            key={key}
            className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelectModule(key)}
          >
            <div className="flex items-center">
              <div 
                className="w-6 h-6 rounded-full mr-2"
                style={{ backgroundColor: module.color }}
              />
              <div>
                <div className="font-medium">{module.label}</div>
                <div className="text-xs text-gray-500">{module.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const NetworkNode = ({ 
  id,
  x, 
  y, 
  radius, 
  color, 
  label, 
  onDrag, 
  isColliding,
  isRoot,
  isConnectable,
  connections,
  onConnectionChange
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  const handleMouseDown = (e) => {
    if (!isRoot) {
      setIsDragging(true);
      const rect = nodeRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      nodeRef.current.setAttribute('data-offset-x', offsetX);
      nodeRef.current.setAttribute('data-offset-y', offsetY);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isRoot) {
      const offsetX = parseFloat(nodeRef.current.getAttribute('data-offset-x'));
      const offsetY = parseFloat(nodeRef.current.getAttribute('data-offset-y'));
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
      onDrag && onDrag(id, newX, newY);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && isConnectable) {
      onConnectionChange && onConnectionChange(id);
    }
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={nodeRef}
      className={`absolute select-none ${isRoot ? '' : 'cursor-move'}`}
      style={{
        left: position.x,
        top: position.y,
        width: radius * 2,
        height: radius * 2,
        transition: isDragging ? 'none' : 'all 0.2s ease-out',
        zIndex: 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${color}88)`,
          border: `2px solid ${isConnectable ? '#22c55e' : isColliding ? '#ff0000' : color}44`,
          backdropFilter: 'blur(4px)',
          boxShadow: `0 0 20px ${isConnectable ? '#22c55e' : isColliding ? '#ff0000' : color}44`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold">
        {label}
      </div>
    </div>
  );
};

const NetworkSimulation = () => {
  const [nodes, setNodes] = useState([
    { 
      id: 1, 
      x: 100, 
      y: 200, 
      radius: 50, 
      color: '#4299e1', 
      label: 'Input',
      isColliding: false,
      isRoot: true,
      isConnectable: false,
      connections: []
    }
  ]);

  const CONNECTION_THRESHOLD = 100; // Distance threshold for connections

  const checkConnectability = (nodeId, x, y) => {
    const draggedNode = nodes.find(n => n.id === nodeId);
    const otherNodes = nodes.filter(n => n.id !== nodeId);
    
    return otherNodes.some(node => {
      const distance = getDistance(
        x + draggedNode.radius,
        y + draggedNode.radius,
        node.x + node.radius,
        node.y + node.radius
      );
      return distance < CONNECTION_THRESHOLD;
    });
  };

  const handleNodeDrag = (id, newX, newY) => {
    setNodes(prevNodes => {
      const updatedNodes = [...prevNodes];
      const draggedNodeIndex = updatedNodes.findIndex(node => node.id === id);
      
      // Check if node can connect to any other node
      const isConnectable = checkConnectability(id, newX, newY);
      
      // Update position and connection status of dragged node
      updatedNodes[draggedNodeIndex] = {
        ...updatedNodes[draggedNodeIndex],
        x: newX,
        y: newY,
        isConnectable
      };
      
      return updatedNodes;
    });
  };

  const handleConnection = (nodeId) => {
    setNodes(prevNodes => {
      const draggedNode = prevNodes.find(n => n.id === nodeId);
      const otherNodes = prevNodes.filter(n => n.id !== nodeId);
      
      const nearbyNode = otherNodes.find(node => {
        const distance = getDistance(
          draggedNode.x + draggedNode.radius,
          draggedNode.y + draggedNode.radius,
          node.x + node.radius,
          node.y + node.radius
        );
        return distance < CONNECTION_THRESHOLD;
      });

      if (nearbyNode) {
        return prevNodes.map(node => {
          if (node.id === nodeId) {
            return {
              ...node,
              connections: [...node.connections, nearbyNode.id],
              isConnectable: false
            };
          }
          if (node.id === nearbyNode.id) {
            return {
              ...node,
              connections: [...node.connections, nodeId]
            };
          }
          return node;
        });
      }
      
      return prevNodes.map(node => ({
        ...node,
        isConnectable: false
      }));
    });
  };

  const handleModuleSelect = (moduleType) => {
    const module = MODULE_TYPES[moduleType];
    const newNode = {
      id: nodes.length + 1,
      x: 300,
      y: 200,
      radius: module.radius,
      color: module.color,
      label: module.label,
      isColliding: false,
      isRoot: false,
      isConnectable: false,
      connections: []
    };
    
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
      <ModuleSelector onSelectModule={handleModuleSelect} />
      
      {/* Render connection lines */}
      {nodes.map(node => 
        node.connections.map(connectedId => {
          const connectedNode = nodes.find(n => n.id === connectedId);
          return (
            <ConnectionLine 
              key={`${node.id}-${connectedId}`}
              startNode={node}
              endNode={connectedNode}
            />
          );
        })
      )}
      
      {/* Render nodes */}
      {nodes.map(node => (
        <NetworkNode
          key={node.id}
          {...node}
          onDrag={handleNodeDrag}
          onConnectionChange={handleConnection}
        />
      ))}
    </div>
  );
};

export default NetworkSimulation;