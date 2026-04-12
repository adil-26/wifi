document.addEventListener('DOMContentLoaded', () => {
    const bind = (id, targetIds) => {
        const input = document.getElementById(id);
        if (!input) return;
        const targets = Array.isArray(targetIds) ? targetIds.map(t => document.getElementById(t)) : [document.getElementById(targetIds)];
        input.addEventListener('input', (e) => {
            targets.forEach(t => { if (t) t.textContent = e.target.value; });
        });
    };

    bind('input-name', ['display-name', 'ack-display-name']);
    bind('input-address', ['display-address', 'ack-display-address']);
    bind('input-contact', 'display-contact');
    bind('input-user-id', 'display-user-id');
    bind('input-plan-name', 'display-plan-name');
    bind('input-invoice-no', ['display-invoice-no', 'ack-display-invoice-no']);
    bind('input-date', ['display-date', 'ack-display-date']);
    bind('input-po-no', 'display-po-no');
    bind('input-po-date', 'display-po-date');
    bind('input-renew-date', ['display-renew-date', 'display-renew-date-desc']);
    bind('input-expire-date', ['display-expire-date', 'display-expire-date-desc']);
    
    // New Fidelity Bindings
    bind('input-paid-by', 'display-paid-by');
    bind('input-collected-by', 'display-collected-by');
    bind('input-payment-mode', 'display-payment-mode');

    const numberToWords = (num) => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const convert = (n) => {
            if (n === 0) return '';
            const res = ('000' + n).substr(-3).match(/^(\d{1})(\d{2})$/);
            if (!res) return '';
            let s = '';
            s += res[1] != 0 ? a[Number(res[1])] + 'Hundred ' : '';
            s += res[2] != 0 ? ((s != '') ? 'and ' : '') + (a[Number(res[2])] || b[res[2][0]] + ' ' + a[res[2][1]]) : '';
            return s;
        };
        const parsed = parseFloat(num);
        if (isNaN(parsed)) return '';
        const whole = Math.floor(parsed);
        const decimal = Math.round((parsed - whole) * 100);
        if (whole === 0 && decimal === 0) return 'Zero Rupees Only';
        let str = '';
        if (whole > 0) {
            const n = ('000000000' + whole).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{3})$/);
            if (n) {
                str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
                str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
                str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
                str += convert(n[4]);
                str += 'Rupees ';
            }
        }
        if (decimal > 0) str += (str ? 'and ' : '') + (a[decimal] || b[decimal.toString()[0]] + ' ' + a[decimal.toString()[1]]) + 'Paisa ';
        return str.toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) + ' only'; // Match exact image casing
    };

    const amountInput = document.getElementById('input-amount');
    const displayWords = document.getElementById('display-amount-words');

    const updateAmount = (val) => {
        const num = val.replace(/[₹\s,]/g, '') || '0';
        const disp = `₹ ${parseFloat(num).toFixed(2)}`;
        ['display-price', 'display-amount', 'display-total-bottom', 'display-subtotal', 'display-total-summary', 'display-received'].forEach(id => {
            const el = document.getElementById(id); if (el) el.textContent = disp;
        });
        
        const ackAmount = document.getElementById('ack-display-amount');
        if (ackAmount) ackAmount.textContent = parseFloat(num).toFixed(1); // Image shows 1 decimal e.g. 500.0

        const balanceEl = document.getElementById('display-balance');
        if (balanceEl) balanceEl.textContent = '₹ 0.00';

        const words = numberToWords(num);
        if (displayWords) displayWords.textContent = words;
    };

    if (amountInput) {
        amountInput.addEventListener('input', (e) => updateAmount(e.target.value));
        updateAmount(amountInput.value);
    }
    
    document.getElementById('btn-download')?.addEventListener('click', () => window.print());
});
