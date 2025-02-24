# Nodeulous
A Open-Sourced Node based visual simulation of Machine learning models and their inner workings.


A visual, interactive tool for building and understanding neural network architectures. This project provides an intuitive, bubble-based interface for constructing neural networks by connecting different types of layers and components. Project is Open Sourced and 100% editable. 

# Features

- Interactive drag-and-drop interface
- Visual component connection system
- Physics-based collision detection
- Real-time visual feedback for connections
- Module selection panel with different layer types
- I was thinking about building it with Unity

## Dependencies

### Core Dependencies
- React (v18.0.0 or higher)
- Tailwind CSS

### Component Libraries
- @shadcn/ui - For UI components
- Lucide React - For icons

## Available Modules

Currently implemented modules include:

- **Linear Layer**: Fully connected layer
- **Conv2D**: Convolutional layer
- **ReLU**: Activation function
- **Attention**: Self-attention layer

Each module is represented by a bubble with:
- Unique color coding
- Size based on complexity/importance
- Visual description
- Connection capabilities

## Controls

### Basic Controls
- **Left Click + Drag**: Move modules around the workspace
- **Release near another module**: Create a connection (when green highlight appears)

### Module Management
1. Select modules from the right panel
2. Drag them to desired position
3. Connect by dragging close to other modules
4. Look for green highlight indicating valid connection points

### Input Node (Root)
- Fixed position input node serves as the starting point
- Cannot be moved or deleted
- Acts as the anchor for your network

### Connection System
- Modules glow green when in connection range
- Connected modules show dashed lines between them
- Connections maintain even when modules are moved

## Project Structure

```
src/
├── components/
│   ├── NetworkNode.jsx        # Individual node component
│   ├── ModuleSelector.jsx     # Module selection panel
│   └── ConnectionLine.jsx     # Connection visualization
├── utils/
│   └── physics.js            # Collision detection and physics calculations
└── App.jsx                   # Main application component
```

## Future Features

Planned enhancements include:
- Data flow visualization
- Module-specific parameter configuration
- Connection validation rules
- Connection deletion
- Save/Load functionality
- Export to framework-specific code (PyTorch, TensorFlow)

## Contributing

This project is under active development. Feel free to contribute by:
1. Opening issues for bugs or feature requests
2. Submitting pull requests with improvements
3. Suggesting new module types or interactions

## License

MIT License - Feel free to use and modify for your own projects.
