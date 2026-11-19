// 土豆與蜜酒 - 點餐系統專屬腳本 (menu.html)
let cart = [];
const cartList = document.getElementById('cart-items-list');
const cartTotalElement = document.getElementById('cart-total');
const orderForm = document.getElementById('order-form');

document.querySelectorAll('.btn-add-order').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.getAttribute('data-name');
    const price = parseInt(button.getAttribute('data-price'), 10);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    renderCart();
  });
});

function renderCart() {
  if (!cartList || !cartTotalElement) return;
  cartList.innerHTML = '';
  if (cart.length === 0) {
    cartList.innerHTML =
      '<li class="placeholder-art" style="text-align:center; padding: 1rem;">尚未選擇餐點或服務</li>';
    cartTotalElement.textContent = '0 Gil';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>${itemTotal} Gil 
        <button style="background:none; border:none; color:#b33939; cursor:pointer; margin-left:6px;" onclick="removeFromCart(${index})">✕</button>
      </span>
    `;
    cartList.appendChild(li);
  });

  cartTotalElement.textContent = `${total} Gil`;
}

window.removeFromCart = function (index) {
  cart.splice(index, 1);
  renderCart();
};

if (orderForm) {
  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('請先點選餐點或服務項目！');
      return;
    }

    const customerName = document.getElementById('customer-name').value;
    const seatNumber = document.getElementById('seat-number').value;
    const notes = document.getElementById('order-notes').value;

    const order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      customer: customerName,
      seat: seatNumber,
      items: cart.map(i => `${i.name}x${i.quantity}`).join(', '),
      notes: notes || '-',
      status: '準備中',
    };

    const orders = JSON.parse(localStorage.getItem('tavern_orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('tavern_orders', JSON.stringify(orders));

    cart = [];
    renderCart();
    orderForm.reset();
    alert(`【${order.customer}】您的點餐已送達後台，店員將盡快為您服務！`);
  });
}

renderCart();
