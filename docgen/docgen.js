const showdown = require('showdown');
const converter = new showdown.Converter();

function extractCommentNodes(RED) {
	let commentNodes = [];
	RED.nodes.eachNode((node) => {
		if (node.type === 'comment' || node.type === 'tab') {
			commentNodes.push({
				label: node.label || node.name || 'Unnamed',
				type: node.type,
				disabled: node.disabled || false,
				info: node.info || '',
				html: converter.makeHtml(node.info),
			});
		}
	});
	return commentNodes;
}

module.exports = function (RED) {
	function DocGen(config) {
		RED.nodes.createNode(this, config);

		this.name = config.name;

		RED.httpAdmin.get('/api/docgen', (req, res) => {
			const nodes = extractCommentNodes(RED);
			res.send(nodes);
		});
	}
	RED.nodes.registerType('docgen', DocGen);
};
