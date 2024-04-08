const blockLists = new Set();

exports.addToBlockList =(adminId) => blockLists.add(adminId)

exports.hasBlocked = (adminId) => blockLists.has(adminId);

exports.removeFromBlockList = (adminId) => blockLists.delete(adminId);