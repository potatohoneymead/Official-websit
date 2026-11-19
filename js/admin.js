// 土豆與蜜酒 - 接單後台專屬腳本 (admin.html)
const adminOrdersTable = document.getElementById('admin-orders-tbody');
const clearOrdersBtn = document.getElementById('clear-orders-btn');

function getOrders() {
  return JSON.parse(localStorage.getItem('tavern_orders') || '[]');
}

function renderAdminOrders() {
  if (!adminOrdersTable) return;
  const orders = getOrders();
  adminOrdersTable.innerHTML = '';

  if (orders.length === 0) {
    adminOrdersTable.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">目前尚無新點單</td>
      </tr>
    `;
    return;
  }

  orders.forEach((order, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.time}</td>
      <td><strong>${order.customer}</strong></td>
      <td>${order.seat}</td>
      <td>${order.items}</td>
      <td>${order.notes}</td>
      <td><span class="status-badge ${order.status === '已完成' ? 'completed' : 'pending'}">${order.status}</span></td>
      <td>
        ${
          order.status === '準備中'
            ? `<button class="admin-btn btn-complete" onclick="toggleOrderStatus(${index})">標記完成</button>`
            : `<span style="color:var(--text-muted); font-size:0.85rem;">已送餐</span>`
        }
      </td>
    `;
    adminOrdersTable.appendChild(tr);
  });
}

window.toggleOrderStatus = function (index) {
  const orders = getOrders();
  orders[index].status = '已完成';
  localStorage.setItem('tavern_orders', JSON.stringify(orders));
  renderAdminOrders();
};

if (clearOrdersBtn) {
  clearOrdersBtn.addEventListener('click', () => {
    if (confirm('確定要清空後台所有歷史訂單嗎？')) {
      localStorage.removeItem('tavern_orders');
      renderAdminOrders();
    }
  });
}

// 支援即時自動更新（跨分頁監聽，客人點單時後台立即刷新）
window.addEventListener('storage', (e) => {
  if (e.key === 'tavern_orders') {
    renderAdminOrders();
  }
});

renderAdminOrders();
