alert('add same name check')
let graphObj = cytoscape({
    container: document.getElementById('graph_canvas'), // container to render in
    elements: [ // list of graph elements to start with
      { // node a
        data: { id: 'a' }
      },
      { // node b
        data: { id: 'b'}
      },
      { // node c
        data: { id: 'c'}
      },
      { // edge ab
        data: { id: 'ab', source: 'a', target: 'b' }
      },
      { // edge bc
        data: { id: 'bc', source: 'b', target: 'c' }
      },
      { // edge cc
        data: { id: 'cc', source: 'c', target: 'c' }
      }
    ],
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 2,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
    layout: {
      name: 'grid',
      rows: 1,
      padding: 30,
    },
    zoom: 1,
  
  });
// Initial zoom
graphObj.zoom({
    level: 1, // the zoom level
    renderedPosition: { x: 300, y: 200 }
  });
// UI STATE
let appState = {
    lastNodeAdded: 'b',
    selectedNode: null,
    zoomLevel: 1,
}
// Node Getter Method
const getNode = (nodeId) => graphObj.getElementById(nodeId)
// Function for adding nodes with entered name
const addNode = () => {
    const nodeName = document.getElementById('node_name').value
    if(nodeName){
        if(getNode(nodeName).length == 0){
            const { lastNodeAdded } = appState;
            const latestNodePosition = getNode(lastNodeAdded).position('x') ? getNode(lastNodeAdded).position('x') : 50;
            appState.lastNodeAdded = nodeName
            graphObj.add({
                group: 'nodes',
                data: { id: nodeName.toLowerCase() },
                position: { x: latestNodePosition + 50, y: 150 }
            });
            document.getElementById('node_name').value = ''
        }else{
            alert('Node already exists')
        }
    }
    else{
        alert('Please enter Node name');
    }
}
// Function for removing selected nodes
const removeNode = () => {
    document.getElementById('node_name').value = ''
    const {selectedNode} = appState
    if(selectedNode){
        const removeSelectedNode = confirm("Are you sure to remove "+ selectedNode+"?"); 
        if (removeSelectedNode == true) { 
            graphObj.remove(getNode(selectedNode));
        }
    appState.selectedNode = ''
    }else {
        alert('Please select a node to delete')
    }

}
// Selecting node on click
graphObj.on('tap', 'node', function(evt){
    document.getElementById('node_name').value = ''
    const node = evt.target;
    const {selectedNode} = appState;
    const source = getNode(selectedNode)
    const target = getNode(node.id())
    if((selectedNode != node.id()) || (source.id() === target.id()) ) {
        const isEdged = source.edgesWith(target).length > 0? true : false
        if(!isEdged && source.id()){
            graphObj.add({
                group: 'edges',
                data: { id: source.id()+target.id(), source : source.id(), target:target.id() }
            });
        }
    }
    appState.selectedNode = node.id()
});

// Zoom in/out 
const zoomIn = () => {
    document.getElementById('node_name').value = ''
    appState.zoomLevel += 0.1
    const {zoomLevel} = appState
    graphObj.animate({zoom: zoomLevel})
}
const zoomOut = () => {
    document.getElementById('node_name').value = ''
    appState.zoomLevel -= 0.1
    const {zoomLevel} = appState
    graphObj.animate({zoom: zoomLevel})
}