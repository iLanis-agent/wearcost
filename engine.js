/* WearCost engine - pure functions for cost-per-wear tracking. */
(function (root) {
  'use strict';
  var nextId = 1;
  function uid() { return 'w' + (nextId++) + '-' + Math.random().toString(36).slice(2, 8); }

  function addItem(list, name, price) {
    name = (name || '').trim();
    price = Number(price);
    if (!name) throw new Error('item needs a name');
    if (!isFinite(price) || price <= 0 || price > 1000000) throw new Error('price must be 0..1000000');
    var it = { id: uid(), name: name, price: Math.round(price * 100) / 100, wears: [] };
    list.push(it);
    return it;
  }

  function removeItem(list, id) {
    var n = list.length;
    var kept = list.filter(function (x) { return x.id !== id; });
    list.length = 0;
    kept.forEach(function (x) { list.push(x); });
    return kept.length < n;
  }

  function logWear(item, date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('date must be YYYY-MM-DD');
    if (item.wears.indexOf(date) >= 0) throw new Error('already logged for ' + date);
    item.wears.push(date);
    item.wears.sort();
    return item;
  }

  function unlogWear(item, date) {
    var i = item.wears.indexOf(date);
    if (i < 0) return false;
    item.wears.splice(i, 1);
    return true;
  }

  // null when never worn (you cannot divide by zero; the app shows the full price at stake)
  function costPerWear(item) {
    if (!item.wears.length) return null;
    return Math.round((item.price / item.wears.length) * 100) / 100;
  }

  // value verdict bands
  function verdict(item) {
    var c = costPerWear(item);
    if (c === null) return 'unworn';
    if (c < 1) return 'workhorse';
    if (c < 5) return 'earning it';
    if (c < 20) return 'pricey';
    return 'closet weight';
  }

  // worst value first: unworn (by price desc), then highest cost-per-wear
  function rankItems(list) {
    return list.map(function (it) {
      return { item: it, cpw: costPerWear(it), verdict: verdict(it) };
    }).sort(function (a, b) {
      if (a.cpw === null && b.cpw === null) return b.item.price - a.item.price;
      if (a.cpw === null) return -1;
      if (b.cpw === null) return 1;
      return b.cpw - a.cpw;
    });
  }

  function wardrobeStats(list) {
    var totalSpent = 0, unwornCount = 0, workhorses = 0;
    list.forEach(function (it) {
      totalSpent += it.price;
      var v = verdict(it);
      if (v === 'unworn') unwornCount++;
      if (v === 'workhorse') workhorses++;
    });
    return {
      items: list.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      unwornCount: unwornCount,
      workhorses: workhorses
    };
  }

  var api = { addItem: addItem, removeItem: removeItem, logWear: logWear, unlogWear: unlogWear, costPerWear: costPerWear, verdict: verdict, rankItems: rankItems, wardrobeStats: wardrobeStats };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WearCost = api;
})(typeof window !== 'undefined' ? window : this);
