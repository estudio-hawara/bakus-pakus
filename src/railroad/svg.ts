export function SVG(document: Document, name: string, attributes: { [key: string]: string } = {}, text: string = '')
{
	const element = document.createElementNS('http://www.w3.org/2000/svg', name);

	for(const attribute in attributes) {
		if(attribute === 'xlink:href')
			element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', attributes[attribute]);
		else
			element.setAttribute(attribute, attributes[attribute]);
	}

	element.textContent = text;

	return element;
}