// ====== DOM LOADED ======
document.addEventListener('DOMContentLoaded', function() {
    initPhoneMask();
    initOrderForm();
    initScrollAnimations();
    initCurrentTime();
});

// ====== TELEFON MASKASI ======
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (!value.startsWith('93')) {
            value = '93' + value;
        }
        
        if (value.length > 2) {
            value = value.substring(0, 2) + ' ' + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + ' ' + value.substring(5);
        }
        if (value.length > 8) {
            value = value.substring(0, 8) + ' ' + value.substring(8);
        }
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        e.target.value = value;
    });
}

// ====== BUYURTMA FORMASI ======
function initOrderForm() {
    const form = document.getElementById('taxiOrderForm');
    const orderMessage = document.getElementById('orderMessage');
    
    // Hozirgi vaqtni o'rnatish
    const now = new Date();
    const timeInput = document.getElementById('time');
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    timeInput.min = localDateTime;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form ma'lumotlarini olish
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            from: document.getElementById('from').value,
            to: document.getElementById('to').value,
            carType: document.getElementById('carType').value,
            time: document.getElementById('time').value || 'Tez orada'
        };
        
        // Telefon raqamni tozalash
        const cleanPhone = formData.phone.replace(/\s/g, '');
        
        // Telegramga yuborish
        sendToTelegram(formData, cleanPhone);
        
        // WhatsApp ga yuborish (ixtiyoriy)
        sendToWhatsApp(formData, cleanPhone);
        
        // Xabarni ko'rsatish
        showMessage('✅ Buyurtmangiz qabul qilindi! Tez orada operator siz bilan bog\'lanadi.', 'success');
        
        // Formani tozalash
        form.reset();
        document.getElementById('phone').value = '93';
        
        // Floating tugmalarni tebratish
        animateButtons();
    });
}

// ====== TELEGRAMGA YUBORISH ======
function sendToTelegram(data, phone) {
    const botToken = ''; // Telegram bot tokeni
    const chatId = ''; // Admin chat ID
    
    const message = `📦 YANGI TAXI BUYURTMASI\n\n` +
                   `👤 Ism: ${data.name}\n` +
                   `📞 Telefon: ${phone}\n` +
                   `📍 Qayerdan: ${data.from}\n` +
                   `🎯 Qayerga: ${data.to}\n` +
                   `🚗 Mashina: ${data.carType}\n` +
                   `⏰ Vaqt: ${data.time}\n` +
                   `🕒 Yuborilgan vaqt: ${new Date().toLocaleString('uz-UZ')}`;
    
    if (botToken && chatId) {
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        }).catch(error => console.error('Telegram error:', error));
    }
    
    // @taxi1351 ga yo'naltirish
    const userMessage = encodeURIComponent(`Salom! Men taxi chaqirmoqchiman:\nIsm: ${data.name}\nTelefon: ${phone}\nManzil: ${data.from}`);
    window.open(`https://t.me/taxi1351?text=${userMessage}`, '_blank
