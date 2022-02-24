function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]'
      || type === '[object Array]';
  } catch (err) {
    return false;
  }
}

function safeParse(data, eventKey) {
  if (data.hasOwnProperty(eventKey)) {
    if (hasJsonStructure(data[eventKey])) {
      return JSON.parse(data[eventKey]);
    } else {
      return data[eventKey];
    }
  } else {
    if (hasJsonStructure(data)) {
      return JSON.parse(data);
    } else {
      return data;
    }
  }

}

module.exports = {
  hasJsonStructure,
  safeParse
}