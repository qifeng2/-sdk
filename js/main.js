// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// 移动端菜单切换
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});

// 点击导航链接后关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// 平滑滚动和导航高亮
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // 减去导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 滚动时更新导航高亮
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// 数字动画效果
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // 检查是否包含数字
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                if (!isNaN(numericValue)) {
                    animateValue(target, 0, numericValue, 2000, finalValue);
                }
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration, finalText) {
    const range = end - start;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    let startTime = new Date().getTime();
    let endTime = startTime + duration;
    let timer;

    function run() {
        let now = new Date().getTime();
        let remaining = Math.max((endTime - now) / duration, 0);
        let value = Math.round(end - (remaining * range));
        
        // 保留原始文本中的非数字部分
        if (finalText.includes('+')) {
            element.textContent = value + '+';
        } else if (finalText.includes('%')) {
            element.textContent = value + '%';
        } else if (finalText.toLowerCase().includes('h')) {
            element.textContent = value + 'h';
        } else {
            element.textContent = value;
        }
        
        if (value == end) {
            element.textContent = finalText;
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    run();
}

// 元素进入视口时的动画
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .case-card, .pricing-card, .why-item, .process-step');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// 表单提交处理
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            contact: document.getElementById('contact').value,
            major: document.getElementById('major').value,
            requirement: document.getElementById('requirement').value
        };
        
        // 简单的表单验证
        if (!formData.name || !formData.contact || !formData.requirement) {
            showNotification('请填写必填项', 'error');
            return;
        }
        
        // 这里可以添加实际的表单提交逻辑
        // 例如发送到后端API或邮件服务
        
        // 模拟提交成功
        showNotification('提交成功！我们会尽快与您联系', 'success');
        contactForm.reset();
        
        // 实际使用时，取消下面的注释并配置您的邮件服务
        /*
        fetch('您的API端点', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            showNotification('提交成功！我们会尽快与您联系', 'success');
            contactForm.reset();
        })
        .catch(error => {
            showNotification('提交失败，请稍后重试或直接联系我们', 'error');
        });
        */
    });
}

// 通知提示功能
function showNotification(message, type = 'info') {
    // 移除已有的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#4f46e5'};
    `;
    
    // 添加关闭按钮样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // 关闭按钮事件
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // 自动关闭
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 价格卡片悬停效果增强
document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// 案例卡片点击效果（可以扩展为打开详情弹窗）
document.querySelectorAll('.case-card').forEach(card => {
    card.addEventListener('click', function() {
        // 可以在这里添加打开案例详情的逻辑
        console.log('案例被点击');
    });
    
    card.style.cursor = 'pointer';
});

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    animateNumbers();
    initScrollAnimations();
    
    // 页面加载完成后的欢迎提示（可选）
    // setTimeout(() => {
    //     showNotification('欢迎来到毕设助手！如有疑问请随时咨询', 'info');
    // }, 2000);
});

// 处理页面可见性变化（节省资源）
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面不可见时暂停动画
        document.body.classList.add('page-hidden');
    } else {
        // 页面可见时恢复动画
        document.body.classList.remove('page-hidden');
    }
});
