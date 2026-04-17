/**
 * chatbot-embed.js - Noteracker Chat Note Embeddable Widget
 * Version: 1.6.0
 * 고객 사이트에 삽입되는 챗봇 위젯 (API키 + 도메인 락 인증)
 *
 * Copyright (c) 2024-2026 Noteracker
 * License: GPL-2.0-or-later
 * https://www.gnu.org/licenses/gpl-2.0.html
 *
 * 사용법:
 * <script src="https://noteracker.com/chatbot-embed.js"
 *   data-api-key="cbk_xxxx"
 *   defer></script>
 */
(function () {
  if (window.__nrChatbotLoaded) return;
  window.__nrChatbotLoaded = true;

  var NRC_VERSION = '1.6.0';

  /* ── Config from script tag ── */
  var script = document.currentScript || (function () {
    var s = document.querySelectorAll('script[data-api-key]');
    return s[s.length - 1];
  })();
  var API_KEY = script && script.getAttribute('data-api-key') || '';
  var API_BASE = (script && script.getAttribute('data-api-base')) || (API_KEY ? 'https://noteracker.com' : window.location.origin);

  if (!API_KEY) { console.info('[Chat Note] No data-api-key, running in self-hosted mode'); }

  /* ── Multi-language translations ── */
  var LANG = {
    en: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Type a message...',
      send: 'Send', powered: 'Powered by Noteracker',
      greeting: 'Hi! How can I help you today?',
      emailAsk: 'Would you like to receive updates? Enter your email:',
      emailPlaceholder: 'your@email.com', emailSubmit: 'Subscribe',
      emailThanks: 'Thanks for subscribing!',
      emailInvalid: 'Please enter a valid email.',
      newChat: 'New Chat', close: 'Close',
      thinking: 'Thinking...',
      errorMsg: 'Sorry, something went wrong. Please try again.',
      limitReached: 'Message limit reached. Please try again later.',
    },
    ko: {
      online: '온라인', offline: '오프라인',
      placeholder: '메시지를 입력하세요...',
      send: '보내기', powered: 'Powered by Noteracker',
      greeting: '안녕하세요! 무엇을 도와드릴까요?',
      emailAsk: '업데이트를 받으시겠어요? 이메일을 입력하세요:',
      emailPlaceholder: 'your@email.com', emailSubmit: '구독',
      emailThanks: '구독해 주셔서 감사합니다!',
      emailInvalid: '유효한 이메일을 입력하세요.',
      newChat: '새 대화', close: '닫기',
      thinking: '생각 중...',
      errorMsg: '죄송합니다, 문제가 발생했습니다. 다시 시도해 주세요.',
      limitReached: '메시지 한도에 도달했습니다. 나중에 다시 시도해 주세요.',
    },
    ja: {
      online: 'オンライン', offline: 'オフライン',
      placeholder: 'メッセージを入力...',
      send: '送信', powered: 'Powered by Noteracker',
      greeting: 'こんにちは！何かお手伝いできますか？',
      emailAsk: 'アップデートを受け取りますか？メールアドレスを入力してください：',
      emailPlaceholder: 'your@email.com', emailSubmit: '購読',
      emailThanks: 'ご購読ありがとうございます！',
      emailInvalid: '有効なメールアドレスを入力してください。',
      newChat: '新しいチャット', close: '閉じる',
      thinking: '考え中...',
      errorMsg: '申し訳ありません、問題が発生しました。もう一度お試しください。',
      limitReached: 'メッセージの上限に達しました。後でもう一度お試しください。',
    },
    zh: {
      online: '在线', offline: '离线',
      placeholder: '输入消息...',
      send: '发送', powered: 'Powered by Noteracker',
      greeting: '你好！有什么可以帮您的吗？',
      emailAsk: '想接收更新吗？请输入您的邮箱：',
      emailPlaceholder: 'your@email.com', emailSubmit: '订阅',
      emailThanks: '感谢订阅！',
      emailInvalid: '请输入有效的邮箱地址。',
      newChat: '新对话', close: '关闭',
      thinking: '思考中...',
      errorMsg: '抱歉，出了点问题。请重试。',
      limitReached: '消息限额已达到，请稍后再试。',
    },
    es: {
      online: 'En línea', offline: 'Desconectado',
      placeholder: 'Escribe un mensaje...',
      send: 'Enviar', powered: 'Powered by Noteracker',
      greeting: '¡Hola! ¿En qué puedo ayudarte?',
      emailAsk: '¿Deseas recibir actualizaciones? Ingresa tu email:',
      emailPlaceholder: 'tu@email.com', emailSubmit: 'Suscribir',
      emailThanks: '¡Gracias por suscribirte!',
      emailInvalid: 'Por favor ingresa un email válido.',
      newChat: 'Nueva conversación', close: 'Cerrar',
      thinking: 'Pensando...',
      errorMsg: 'Lo siento, algo salió mal. Por favor inténtalo de nuevo.',
      limitReached: 'Límite de mensajes alcanzado. Inténtalo más tarde.',
    },
    vi: {
      online: 'Trực tuyến', offline: 'Ngoại tuyến',
      placeholder: 'Nhập tin nhắn...',
      send: 'Gửi', powered: 'Powered by Noteracker',
      greeting: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      emailAsk: 'Bạn muốn nhận thông tin cập nhật? Nhập email của bạn:',
      emailPlaceholder: 'email@cuaban.com', emailSubmit: 'Đăng ký',
      emailThanks: 'Cảm ơn bạn đã đăng ký!',
      emailInvalid: 'Vui lòng nhập email hợp lệ.',
      newChat: 'Cuộc trò chuyện mới', close: 'Đóng',
      thinking: 'Đang suy nghĩ...',
      errorMsg: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
      limitReached: 'Đã đạt giới hạn tin nhắn. Vui lòng thử lại sau.',
    },
    id: {
      online: 'Daring', offline: 'Luring',
      placeholder: 'Ketik pesan...',
      send: 'Kirim', powered: 'Powered by Noteracker',
      greeting: 'Halo! Ada yang bisa saya bantu?',
      emailAsk: 'Ingin menerima pembaruan? Masukkan email Anda:',
      emailPlaceholder: 'email@anda.com', emailSubmit: 'Berlangganan',
      emailThanks: 'Terima kasih sudah berlangganan!',
      emailInvalid: 'Silakan masukkan email yang valid.',
      newChat: 'Percakapan baru', close: 'Tutup',
      thinking: 'Sedang berpikir...',
      errorMsg: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
      limitReached: 'Batas pesan tercapai. Silakan coba lagi nanti.',
    },
    th: {
      online: 'ออนไลน์', offline: 'ออฟไลน์',
      placeholder: 'พิมพ์ข้อความ...',
      send: 'ส่ง', powered: 'Powered by Noteracker',
      greeting: 'สวัสดี! มีอะไรให้ช่วยไหม?',
      emailAsk: 'ต้องการรับข่าวสารไหม? กรอกอีเมลของคุณ:',
      emailPlaceholder: 'your@email.com', emailSubmit: 'สมัคร',
      emailThanks: 'ขอบคุณที่สมัคร!',
      emailInvalid: 'กรุณากรอกอีเมลที่ถูกต้อง',
      newChat: 'แชทใหม่', close: 'ปิด',
      thinking: 'กำลังคิด...',
      errorMsg: 'ขออภัย เกิดข้อผิดพลาด กรุณาลองอีกครั้ง',
      limitReached: 'ถึงขีดจำกัดข้อความแล้ว กรุณาลองอีกครั้งในภายหลัง',
    },
    fr: {
      online: 'En ligne', offline: 'Hors ligne',
      placeholder: 'Tapez un message...',
      send: 'Envoyer', powered: 'Powered by Noteracker',
      greeting: 'Bonjour ! Comment puis-je vous aider ?',
      emailAsk: 'Souhaitez-vous recevoir des mises à jour ? Entrez votre email :',
      emailPlaceholder: 'votre@email.com', emailSubmit: "S'abonner",
      emailThanks: 'Merci pour votre abonnement !',
      emailInvalid: 'Veuillez entrer un email valide.',
      newChat: 'Nouvelle conversation', close: 'Fermer',
      thinking: 'Réflexion...',
      errorMsg: "Désolé, une erreur s'est produite. Veuillez réessayer.",
      limitReached: 'Limite de messages atteinte. Veuillez réessayer plus tard.',
    },
    de: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Nachricht eingeben...',
      send: 'Senden', powered: 'Powered by Noteracker',
      greeting: 'Hallo! Wie kann ich Ihnen helfen?',
      emailAsk: 'Möchten Sie Updates erhalten? Geben Sie Ihre E-Mail ein:',
      emailPlaceholder: 'ihre@email.com', emailSubmit: 'Abonnieren',
      emailThanks: 'Danke für Ihr Abonnement!',
      emailInvalid: 'Bitte geben Sie eine gültige E-Mail ein.',
      newChat: 'Neuer Chat', close: 'Schließen',
      thinking: 'Denke nach...',
      errorMsg: 'Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
      limitReached: 'Nachrichtenlimit erreicht. Bitte versuchen Sie es später erneut.',
    },
    pt: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Digite uma mensagem...',
      send: 'Enviar', powered: 'Powered by Noteracker',
      greeting: 'Olá! Como posso ajudá-lo?',
      emailAsk: 'Deseja receber atualizações? Digite seu email:',
      emailPlaceholder: 'seu@email.com', emailSubmit: 'Inscrever',
      emailThanks: 'Obrigado por se inscrever!',
      emailInvalid: 'Por favor, insira um email válido.',
      newChat: 'Nova conversa', close: 'Fechar',
      thinking: 'Pensando...',
      errorMsg: 'Desculpe, algo deu errado. Por favor, tente novamente.',
      limitReached: 'Limite de mensagens atingido. Tente novamente mais tarde.',
    },
    ar: {
      online: 'متصل', offline: 'غير متصل',
      placeholder: 'اكتب رسالة...',
      send: 'إرسال', powered: 'Powered by Noteracker',
      greeting: 'مرحبا! كيف يمكنني مساعدتك؟',
      emailAsk: 'هل ترغب في تلقي التحديثات؟ أدخل بريدك الإلكتروني:',
      emailPlaceholder: 'your@email.com', emailSubmit: 'اشترك',
      emailThanks: 'شكراً لاشتراكك!',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صالح.',
      newChat: 'محادثة جديدة', close: 'إغلاق',
      thinking: 'جاري التفكير...',
      errorMsg: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
      limitReached: 'تم الوصول إلى حد الرسائل. يرجى المحاولة مرة أخرى لاحقاً.',
    },
    ms: {
      online: 'Dalam Talian', offline: 'Luar Talian',
      placeholder: 'Taip mesej...',
      send: 'Hantar', powered: 'Powered by Noteracker',
      greeting: 'Hai! Bagaimana saya boleh membantu anda?',
      emailAsk: 'Ingin menerima kemas kini? Masukkan e-mel anda:',
      emailPlaceholder: 'emel@anda.com', emailSubmit: 'Langgan',
      emailThanks: 'Terima kasih kerana melanggan!',
      emailInvalid: 'Sila masukkan e-mel yang sah.',
      newChat: 'Perbualan baharu', close: 'Tutup',
      thinking: 'Sedang berfikir...',
      errorMsg: 'Maaf, sesuatu telah berlaku. Sila cuba lagi.',
      limitReached: 'Had mesej dicapai. Sila cuba lagi kemudian.',
    },
    hi: {
      online: 'ऑनलाइन', offline: 'ऑफलाइन',
      placeholder: 'संदेश लिखें...',
      send: 'भेजें', powered: 'Powered by Noteracker',
      greeting: 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
      emailAsk: 'क्या आप अपडेट प्राप्त करना चाहेंगे? अपना ईमेल दर्ज करें:',
      emailPlaceholder: 'your@email.com', emailSubmit: 'सदस्यता लें',
      emailThanks: 'सदस्यता के लिए धन्यवाद!',
      emailInvalid: 'कृपया एक वैध ईमेल दर्ज करें।',
      newChat: 'नई बातचीत', close: 'बंद करें',
      thinking: 'सोच रहा हूँ...',
      errorMsg: 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।',
      limitReached: 'संदेश सीमा पूरी हो गई। कृपया बाद में पुनः प्रयास करें।',
    },
    it: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Scrivi un messaggio...',
      send: 'Invia', powered: 'Powered by Noteracker',
      greeting: 'Ciao! Come posso aiutarti?',
      emailAsk: 'Vuoi ricevere aggiornamenti? Inserisci la tua email:',
      emailPlaceholder: 'tua@email.com', emailSubmit: 'Iscriviti',
      emailThanks: 'Grazie per esserti iscritto!',
      emailInvalid: 'Inserisci un indirizzo email valido.',
      newChat: 'Nuova conversazione', close: 'Chiudi',
      thinking: 'Sto pensando...',
      errorMsg: 'Spiacente, qualcosa non ha funzionato. Riprova.',
      limitReached: 'Limite messaggi raggiunto. Riprova più tardi.',
    },
    sv: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Skriv ett meddelande...',
      send: 'Skicka', powered: 'Powered by Noteracker',
      greeting: 'Hej! Hur kan jag hjälpa dig?',
      emailAsk: 'Vill du få uppdateringar? Ange din e-post:',
      emailPlaceholder: 'din@email.com', emailSubmit: 'Prenumerera',
      emailThanks: 'Tack för din prenumeration!',
      emailInvalid: 'Ange en giltig e-postadress.',
      newChat: 'Ny chatt', close: 'Stäng',
      thinking: 'Tänker...',
      errorMsg: 'Något gick fel. Försök igen.',
      limitReached: 'Meddelandegränsen nådd. Försök igen senare.',
    },
    fi: {
      online: 'Paikalla', offline: 'Poissa',
      placeholder: 'Kirjoita viesti...',
      send: 'Lähetä', powered: 'Powered by Noteracker',
      greeting: 'Hei! Kuinka voin auttaa sinua?',
      emailAsk: 'Haluatko saada päivityksiä? Syötä sähköpostisi:',
      emailPlaceholder: 'sinun@email.com', emailSubmit: 'Tilaa',
      emailThanks: 'Kiitos tilauksesta!',
      emailInvalid: 'Anna kelvollinen sähköpostiosoite.',
      newChat: 'Uusi keskustelu', close: 'Sulje',
      thinking: 'Mietin...',
      errorMsg: 'Jokin meni pieleen. Yritä uudelleen.',
      limitReached: 'Viestiraja saavutettu. Yritä myöhemmin uudelleen.',
    },
    da: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Skriv en besked...',
      send: 'Send', powered: 'Powered by Noteracker',
      greeting: 'Hej! Hvordan kan jeg hjælpe dig?',
      emailAsk: 'Vil du modtage opdateringer? Indtast din e-mail:',
      emailPlaceholder: 'din@email.com', emailSubmit: 'Abonner',
      emailThanks: 'Tak for dit abonnement!',
      emailInvalid: 'Indtast venligst en gyldig e-mail.',
      newChat: 'Ny samtale', close: 'Luk',
      thinking: 'Tænker...',
      errorMsg: 'Beklager, noget gik galt. Prøv igen.',
      limitReached: 'Beskedgrænsen er nået. Prøv igen senere.',
    },
    hu: {
      online: 'Online', offline: 'Offline',
      placeholder: 'Írjon üzenetet...',
      send: 'Küldés', powered: 'Powered by Noteracker',
      greeting: 'Szia! Miben segíthetek?',
      emailAsk: 'Szeretne frissítéseket kapni? Adja meg e-mail címét:',
      emailPlaceholder: 'az@email.com', emailSubmit: 'Feliratkozás',
      emailThanks: 'Köszönjük a feliratkozást!',
      emailInvalid: 'Kérjük, adjon meg érvényes e-mail címet.',
      newChat: 'Új beszélgetés', close: 'Bezárás',
      thinking: 'Gondolkodom...',
      errorMsg: 'Sajnálom, hiba történt. Kérjük, próbálja újra.',
      limitReached: 'Üzenetkorlát elérve. Kérjük, próbálja újra később.',
    },
    he: {
      online: 'מחובר', offline: 'לא מחובר',
      placeholder: 'הקלד הודעה...',
      send: 'שלח', powered: 'Powered by Noteracker',
      greeting: 'שלום! איך אוכל לעזור לך?',
      emailAsk: 'רוצה לקבל עדכונים? הזן את האימייל שלך:',
      emailPlaceholder: 'your@email.com', emailSubmit: 'הרשמה',
      emailThanks: 'תודה על ההרשמה!',
      emailInvalid: 'אנא הזן כתובת אימייל תקינה.',
      newChat: 'שיחה חדשה', close: 'סגור',
      thinking: 'חושב...',
      errorMsg: 'מצטער, משהו השתבש. אנא נסה שוב.',
      limitReached: 'הגעת למגבלת ההודעות. אנא נסה שוב מאוחר יותר.',
    },
  };

  /* ── Ticket translations (all 20 languages) ── */
  var TICKET_LANG = {
    en: { title:'Create Support Ticket', name:'Your name', email:'Your email *', subject:'Subject *', desc:'Describe your issue...', cancel:'Cancel', submit:'Submit Ticket', required:'Email and subject are required.', success:'Ticket #{id} created! We\'ll get back to you soon.', fail:'Failed to create ticket.' },
    ko: { title:'지원 티켓 생성', name:'이름', email:'이메일 *', subject:'제목 *', desc:'문제를 설명해 주세요...', cancel:'취소', submit:'티켓 제출', required:'이메일과 제목은 필수입니다.', success:'티켓 #{id}이 생성되었습니다!', fail:'티켓 생성 실패.' },
    ja: { title:'サポートチケット作成', name:'お名前', email:'メール *', subject:'件名 *', desc:'問題を説明してください...', cancel:'キャンセル', submit:'チケット送信', required:'メールと件名は必須です。', success:'チケット #{id} が作成されました！', fail:'チケット作成に失敗しました。' },
    zh: { title:'创建支持工单', name:'您的姓名', email:'邮箱 *', subject:'主题 *', desc:'描述您的问题...', cancel:'取消', submit:'提交工单', required:'邮箱和主题是必填项。', success:'工单 #{id} 已创建！', fail:'工单创建失败。' },
    es: { title:'Crear Ticket', name:'Tu nombre', email:'Tu email *', subject:'Asunto *', desc:'Describe tu problema...', cancel:'Cancelar', submit:'Enviar Ticket', required:'Email y asunto son obligatorios.', success:'Ticket #{id} creado!', fail:'Error al crear ticket.' },
    vi: { title:'Tạo Yêu Cầu', name:'Tên của bạn', email:'Email *', subject:'Chủ đề *', desc:'Mô tả vấn đề...', cancel:'Hủy', submit:'Gửi Yêu Cầu', required:'Email và chủ đề là bắt buộc.', success:'Yêu cầu #{id} đã tạo!', fail:'Không thể tạo yêu cầu.' },
    id: { title:'Buat Tiket', name:'Nama Anda', email:'Email *', subject:'Subjek *', desc:'Jelaskan masalah...', cancel:'Batal', submit:'Kirim Tiket', required:'Email dan subjek wajib.', success:'Tiket #{id} dibuat!', fail:'Gagal membuat tiket.' },
    th: { title:'สร้างตั๋วสนับสนุน', name:'ชื่อของคุณ', email:'อีเมล *', subject:'หัวข้อ *', desc:'อธิบายปัญหา...', cancel:'ยกเลิก', submit:'ส่งตั๋ว', required:'ต้องกรอกอีเมลและหัวข้อ', success:'ตั๋ว #{id} สร้างแล้ว!', fail:'ไม่สามารถสร้างตั๋ว' },
    fr: { title:'Créer un Ticket', name:'Votre nom', email:'Votre email *', subject:'Sujet *', desc:'Décrivez votre problème...', cancel:'Annuler', submit:'Envoyer', required:'Email et sujet requis.', success:'Ticket #{id} créé !', fail:'Échec de la création.' },
    de: { title:'Ticket erstellen', name:'Ihr Name', email:'Ihre E-Mail *', subject:'Betreff *', desc:'Beschreiben Sie Ihr Problem...', cancel:'Abbrechen', submit:'Ticket senden', required:'E-Mail und Betreff erforderlich.', success:'Ticket #{id} erstellt!', fail:'Ticket-Erstellung fehlgeschlagen.' },
    pt: { title:'Criar Ticket', name:'Seu nome', email:'Seu email *', subject:'Assunto *', desc:'Descreva seu problema...', cancel:'Cancelar', submit:'Enviar Ticket', required:'Email e assunto obrigatórios.', success:'Ticket #{id} criado!', fail:'Falha ao criar ticket.' },
    ar: { title:'إنشاء تذكرة', name:'اسمك', email:'بريدك *', subject:'الموضوع *', desc:'اوصف مشكلتك...', cancel:'إلغاء', submit:'إرسال', required:'البريد والموضوع مطلوبان.', success:'تذكرة #{id} أُنشئت!', fail:'فشل إنشاء التذكرة.' },
    ms: { title:'Cipta Tiket', name:'Nama anda', email:'E-mel *', subject:'Subjek *', desc:'Terangkan masalah...', cancel:'Batal', submit:'Hantar Tiket', required:'E-mel dan subjek diperlukan.', success:'Tiket #{id} dicipta!', fail:'Gagal mencipta tiket.' },
    hi: { title:'सहायता टिकट', name:'आपका नाम', email:'ईमेल *', subject:'विषय *', desc:'समस्या बताएं...', cancel:'रद्द', submit:'टिकट भेजें', required:'ईमेल और विषय आवश्यक।', success:'टिकट #{id} बनाया गया!', fail:'टिकट बनाने में विफल।' },
    it: { title:'Crea Ticket', name:'Il tuo nome', email:'La tua email *', subject:'Oggetto *', desc:'Descrivi il problema...', cancel:'Annulla', submit:'Invia Ticket', required:'Email e oggetto richiesti.', success:'Ticket #{id} creato!', fail:'Creazione ticket fallita.' },
    sv: { title:'Skapa Ärende', name:'Ditt namn', email:'Din e-post *', subject:'Ämne *', desc:'Beskriv ditt problem...', cancel:'Avbryt', submit:'Skicka', required:'E-post och ämne krävs.', success:'Ärende #{id} skapat!', fail:'Kunde inte skapa ärende.' },
    fi: { title:'Luo Tukipyyntö', name:'Nimesi', email:'Sähköpostisi *', subject:'Aihe *', desc:'Kuvaile ongelmasi...', cancel:'Peruuta', submit:'Lähetä', required:'Sähköposti ja aihe vaaditaan.', success:'Tukipyyntö #{id} luotu!', fail:'Luonti epäonnistui.' },
    da: { title:'Opret Sag', name:'Dit navn', email:'Din e-mail *', subject:'Emne *', desc:'Beskriv dit problem...', cancel:'Annuller', submit:'Send', required:'E-mail og emne påkrævet.', success:'Sag #{id} oprettet!', fail:'Kunne ikke oprette sag.' },
    hu: { title:'Jegy Létrehozása', name:'Neve', email:'E-mail *', subject:'Tárgy *', desc:'Írja le a problémát...', cancel:'Mégse', submit:'Küldés', required:'E-mail és tárgy szükséges.', success:'Jegy #{id} létrehozva!', fail:'Nem sikerült létrehozni.' },
    he: { title:'יצירת כרטיס', name:'שמך', email:'אימייל *', subject:'נושא *', desc:'תאר את הבעיה...', cancel:'ביטול', submit:'שלח', required:'אימייל ונושא נדרשים.', success:'כרטיס #{id} נוצר!', fail:'יצירה נכשלה.' },
  };

  /* ── State ── */
  var config = null;
  var t = LANG.en;
  var tt = TICKET_LANG.en;
  var conversationId = null;
  var visitorId;
  try {
    visitorId = localStorage.getItem('nrc_visitor') || ('v_' + Math.random().toString(36).slice(2, 10));
    localStorage.setItem('nrc_visitor', visitorId);
  } catch (_) { visitorId = 'v_' + Math.random().toString(36).slice(2, 10); }
  var isOpen = false;
  var isLoading = false;
  var msgCount = 0;
  var emailCollected = false;
  try { emailCollected = !!localStorage.getItem('nrc_email_' + API_KEY); } catch (_) {}
  var pageContentSent = false;
  var _proactiveSections = new Set();
  var _lastProactiveTime = 0;
  var _sectionDwellMs = 2000;
  var _ticketOpen = false;
  var _wasHidden = false;

  /* Conversation persistence */
  try { conversationId = localStorage.getItem('nrc_conv_' + API_KEY) || null; } catch (_) {}

  /* ── Session-level section tracking (prevent re-show within session) ── */
  function getSessionShown() {
    try { var d = sessionStorage.getItem('nrc_sections'); return d ? JSON.parse(d) : {}; } catch (_) { return {}; }
  }
  function markSectionShown(id) {
    _proactiveSections.add(id);
    try {
      var obj = getSessionShown();
      obj[id] = true;
      sessionStorage.setItem('nrc_sections', JSON.stringify(obj));
    } catch (_) {}
  }

  /* ── Utility ── */
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }

  /* ── Read data-* overrides from script tag ── */
  var OVERRIDES = {};
  if (script) {
    var attrMap = {
      'data-bot-name': 'bot_name',
      'data-bot-greeting': 'bot_greeting',
      'data-primary-color': 'primary_color',
      'data-header-bg': 'header_bg_color',
      'data-user-bubble': 'user_bubble_color',
      'data-bot-bubble': 'bot_bubble_color',
      'data-widget-width': 'widget_width',
      'data-widget-height': 'widget_height',
      'data-toggle-size': 'toggle_size',
      'data-font-size': 'font_size',
      'data-border-radius': 'border_radius',
      'data-language': 'default_language',
      'data-position': 'widget_position',
      'data-profile-image': 'bot_profile_image_url',
      'data-logo': 'bot_logo_url',
      'data-section-dwell': 'section_dwell_time',
    };
    for (var ak in attrMap) {
      var av = script.getAttribute(ak);
      if (av) OVERRIDES[attrMap[ak]] = av;
    }
  }

  /* ── Default config (used when API fails) ── */
  var DEFAULT_CONFIG = {
    bot_name: 'AI Assistant', bot_greeting: '',
    bot_logo_url: '', bot_profile_image_url: '',
    bot_profile_images: [], profile_image_interval_ms: 0,
    primary_color: '#667eea', secondary_color: '#764ba2',
    header_bg_color: '#1c2228', user_bubble_color: '#667eea',
    bot_bubble_color: '#252b30', widget_position: 'bottom-right',
    widget_width: 360, widget_height: 520,
    toggle_size: 62, font_size: 14, border_radius: 16,
    default_language: 'en', auto_detect_language: 0,
    email_collection_enabled: 1, email_collection_msg: '',
    section_dwell_time: 2000,
  };

  function applyOverrides(cfg) {
    for (var k in OVERRIDES) {
      cfg[k] = /^\d+$/.test(OVERRIDES[k]) ? parseInt(OVERRIDES[k]) : OVERRIDES[k];
    }
    if (OVERRIDES.default_language) cfg.auto_detect_language = 0;
    return cfg;
  }

  /* ── Load config from API ── */
  function loadConfig(cb, bust) {
    var x = new XMLHttpRequest();
    var _cfgUrl = API_BASE + '/api/chatbot-ext/config?key=' + encodeURIComponent(API_KEY);
    if (bust) _cfgUrl += '&_t=' + Date.now();
    x.open('GET', _cfgUrl);
    x.setRequestHeader('X-Api-Key', API_KEY);
    x.timeout = 5000;
    x.onload = function () {
      if (x.status === 200) {
        try { config = JSON.parse(x.responseText); } catch (e) { config = {}; }
      } else {
        console.warn('[Chat Note] Config API returned', x.status, '- using defaults');
        config = {};
      }
      for (var dk in DEFAULT_CONFIG) { if (config[dk] === undefined || config[dk] === null) config[dk] = DEFAULT_CONFIG[dk]; }
      config = applyOverrides(config);
      var lang = 'en';
      config._lang = lang;
      t = JSON.parse(JSON.stringify(LANG.en));
      tt = TICKET_LANG.en;
      if (config.bot_greeting) t.greeting = config.bot_greeting;
      _sectionDwellMs = parseInt(config.section_dwell_time) || 2000;
      scheduleProfileRotation(config);
      cb(config);
    };
    x.onerror = x.ontimeout = function () {
      console.warn('[Chat Note] Config failed - using defaults');
      config = applyOverrides(JSON.parse(JSON.stringify(DEFAULT_CONFIG)));
      config._lang = 'en';
      t = JSON.parse(JSON.stringify(LANG.en));
      tt = TICKET_LANG.en;
      if (config.bot_greeting) t.greeting = config.bot_greeting;
      cb(config);
    };
    x.send();
  }

  /* ── Build CSS ── */
  function injectStyles(c) {
    var primary = c.primary_color || '#667eea';
    var secondary = c.secondary_color || '#764ba2';
    var headerBg = c.header_bg_color || '#1c2228';
    var userBubble = c.user_bubble_color || '#667eea';
    var botBubble = c.bot_bubble_color || '#252b30';
    var w = (c.widget_width || 360) + 'px';
    var h = (c.widget_height || 520) + 'px';
    var toggle = (c.toggle_size || 62) + 'px';
    var font = (c.font_size || 14) + 'px';
    var radius = (c.border_radius || 16) + 'px';
    var avatarSz = Math.max(parseInt(c.toggle_size || 62) - 8, 40) + 'px';
    var isRtl = (c._lang === 'ar' || c._lang === 'he') ? 'direction:rtl;' : '';
    var posRight = (c.widget_position !== 'bottom-left');
    var wrapSide = posRight ? 'right:24px;' : 'left:24px;';
    var panelSide = posRight ? 'right:0;' : 'left:0;';
    var bubbleSide = posRight ? 'right:8px;' : 'left:8px;';
    var dotSide = posRight ? 'right:2px;' : 'left:2px;';
    var bubbleRadius = posRight ? '12px 12px 4px 12px' : '12px 12px 12px 4px';
    var bubbleCloseSide = posRight ? 'right:-6px;' : 'left:-6px;';

    var css = '\
.nrc-wrap{position:fixed;bottom:24px;' + wrapSide + 'z-index:99999;font-family:"Noto Sans",Arial,sans-serif;' + isRtl + '}\
.nrc-toggle{width:' + toggle + ';height:' + toggle + ';border-radius:50%;border:none;cursor:pointer;\
background:linear-gradient(135deg,' + primary + ',#764ba2,' + primary + ');background-size:300% 300%;\
animation:nrcGrad 4s ease infinite;box-shadow:0 4px 16px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;\
position:relative;transition:transform .2s;padding:0;}\
.nrc-toggle:hover{transform:scale(1.08);}\
.nrc-toggle-avatar{width:' + avatarSz + ';height:' + avatarSz + ';border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.85);\
transition:opacity .25s,transform .25s;}\
.nrc-toggle-close{position:absolute;color:#fff;font-size:26px;font-weight:700;opacity:0;transform:rotate(90deg) scale(.5);transition:all .25s;}\
.nrc-open .nrc-toggle-avatar{opacity:0;transform:scale(.5);}\
.nrc-open .nrc-toggle-close{opacity:1;transform:rotate(0) scale(1);}\
.nrc-toggle::after{content:"";position:absolute;bottom:2px;' + dotSide + 'width:14px;height:14px;background:#4caf50;\
border-radius:50%;border:2px solid #1c2228;}\
@keyframes nrcGrad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}\
\
.nrc-panel{position:absolute;bottom:calc(' + toggle + ' + 16px);' + panelSide + 'width:' + w + ';max-height:' + h + ';\
background:#1c2228;border:1px solid #323841;border-radius:' + radius + ';box-shadow:0 8px 32px rgba(0,0,0,.45);\
display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px) scale(.96);\
pointer-events:none;transition:opacity .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1);}\
.nrc-open .nrc-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}\
\
.nrc-header{display:flex;align-items:center;gap:10px;padding:12px 16px;background:' + headerBg + ';\
border-bottom:1px solid #323841;flex-shrink:0;}\
.nrc-header-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid rgba(255,255,255,.15);}\
.nrc-header-info{flex:1;}\
.nrc-header-name{font-size:13.5px;font-weight:600;color:#fff;}\
.nrc-header-status{font-size:11px;color:#4caf50;display:flex;align-items:center;gap:4px;}\
.nrc-header-status::before{content:"";width:6px;height:6px;background:#4caf50;border-radius:50%;}\
.nrc-header-btn{background:none;border:none;color:#9e9e9e;cursor:pointer;padding:4px;font-size:16px;transition:color .2s;}\
.nrc-header-btn:hover{color:' + primary + ';}\
\
.nrc-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:200px;\
scrollbar-width:thin;scrollbar-color:#3a424b transparent;}\
.nrc-messages::-webkit-scrollbar{width:4px;}\
.nrc-messages::-webkit-scrollbar-thumb{background:#3a424b;border-radius:4px;}\
\
.nrc-msg{max-width:85%;padding:10px 14px;font-size:' + font + ';line-height:1.5;word-break:break-word;}\
.nrc-msg-user{align-self:flex-end;background:' + userBubble + ';color:#1c2228;border-radius:' + radius + ' ' + radius + ' 4px ' + radius + ';}\
.nrc-msg-bot{align-self:flex-start;background:' + botBubble + ';color:#e0e0e0;border-radius:' + radius + ' ' + radius + ' ' + radius + ' 4px;}\
.nrc-bot-row{display:flex;align-items:flex-end;gap:8px;align-self:flex-start;max-width:90%;}\
.nrc-bot-row .nrc-msg-bot{align-self:unset;max-width:100%;}\
.nrc-bot-row .nrc-typing{align-self:unset;}\
.nrc-msg-bot-av{width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0;border:1.5px solid rgba(255,255,255,.15);}\
\
.nrc-typing{display:flex;gap:4px;padding:10px 14px;align-self:flex-start;background:' + botBubble + ';border-radius:12px;}\
.nrc-typing span{width:6px;height:6px;background:#888;border-radius:50%;animation:nrcBounce 1.2s infinite;}\
.nrc-typing span:nth-child(2){animation-delay:.2s;}\
.nrc-typing span:nth-child(3){animation-delay:.4s;}\
@keyframes nrcBounce{0%,80%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}\
\
.nrc-form{display:flex;gap:8px;padding:12px;border-top:1px solid #323841;flex-shrink:0;}\
.nrc-input{flex:1;padding:10px 14px;background:#1c2228;border:1px solid #3a424b;border-radius:22px;\
color:#fff;font-size:' + font + ';font-family:inherit;outline:none;}\
.nrc-input:focus{border-color:' + primary + ';}\
.nrc-send{padding:8px 16px;background:' + primary + ';color:#1c2228;border:none;border-radius:22px;\
font-weight:600;font-size:13px;cursor:pointer;font-family:inherit;transition:opacity .2s;}\
.nrc-send:hover{opacity:.85;}\
.nrc-send:disabled{opacity:.4;cursor:default;}\
\
.nrc-email-wrap{display:flex;gap:8px;margin-top:10px;align-items:center;}\
.nrc-email-input{flex:1;min-width:0;padding:10px 14px;background:#1c2228;border:1px solid #3a424b;border-radius:20px;\
color:#fff;font-size:13px;outline:none;font-family:inherit;}\
.nrc-email-btn{padding:10px 20px;background:' + primary + ';color:#1c2228;border:none;border-radius:20px;\
font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0;}\
\
\
\
.nrc-settings{display:none;flex-direction:column;align-items:center;gap:16px;padding:24px 20px;flex:1;overflow-y:auto;}\
.nrc-settings.nrc-show{display:flex;}\
.nrc-settings-title{font-size:14px;font-weight:700;color:#fff;}\
.nrc-settings-avatar-wrap{width:80px;height:80px;position:relative;}\
.nrc-settings-avatar{width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid #3a424b;}\
.nrc-settings-placeholder{width:80px;height:80px;border-radius:50%;background:#252b30;border:2px dashed #3a424b;\
display:flex;align-items:center;justify-content:center;color:#666;font-size:28px;}\
.nrc-settings-hint{font-size:11px;color:#888;text-align:center;line-height:1.4;}\
.nrc-settings-file{display:none;}\
.nrc-settings-btn{padding:8px 20px;background:' + primary + ';color:#1c2228;border:none;border-radius:20px;\
font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:opacity .2s;}\
.nrc-settings-btn:hover{opacity:.85;}\
.nrc-settings-btn:disabled{opacity:.4;cursor:default;}\
.nrc-settings-status{font-size:12px;color:#4caf50;min-height:18px;}\
.nrc-settings-back{background:none;border:1px solid #3a424b;color:#ccc;padding:6px 16px;border-radius:20px;\
font-size:12px;cursor:pointer;font-family:inherit;}\
.nrc-settings-back:hover{border-color:#888;}\
\
.nrc-bubble{position:absolute;bottom:calc(' + toggle + ' + 8px);' + bubbleSide + 'width:max-content;max-width:240px;\
padding:10px 14px;border-radius:' + bubbleRadius + ';\
font-size:13px;line-height:1.4;\
animation:nrcBubbleIn .35s cubic-bezier(.4,0,.2,1);cursor:pointer;z-index:99998;word-wrap:break-word;}\
.nrc-bubble-close{position:absolute;top:-6px;' + bubbleCloseSide + 'width:18px;height:18px;border-radius:50%;\
background:#3a424b;color:#fff;font-size:12px;line-height:18px;text-align:center;cursor:pointer;}\
@keyframes nrcBubbleIn{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}\
.nrc-pulse{animation:nrcPulseAnim 1.5s ease-in-out 3;}\
@keyframes nrcPulseAnim{0%,100%{box-shadow:0 4px 16px rgba(0,0,0,.35)}50%{box-shadow:0 0 0 8px rgba(102,126,234,.3)}}\
\
.nrc-ticket{display:none;flex-direction:column;gap:10px;padding:20px;flex:1;overflow-y:auto;}\
.nrc-ticket.nrc-show{display:flex;}\
.nrc-ticket-title{font-size:14px;font-weight:700;color:#fff;}\
.nrc-ticket input,.nrc-ticket textarea{padding:8px 12px;background:#1c2228;border:1px solid #3a424b;\
border-radius:8px;color:#fff;font-size:13px;font-family:inherit;outline:none;}\
.nrc-ticket input:focus,.nrc-ticket textarea:focus{border-color:' + primary + ';}\
.nrc-ticket textarea{min-height:80px;resize:vertical;}\
.nrc-ticket-btns{display:flex;gap:8px;}\
.nrc-ticket-btns button{flex:1;padding:8px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}\
.nrc-ticket-cancel{background:none;border:1px solid #3a424b;color:#ccc;}\
.nrc-ticket-submit{background:' + primary + ';border:none;color:#1c2228;}\
\
@media(max-width:480px){\
.nrc-wrap{bottom:16px;' + (posRight ? 'right:16px;' : 'left:16px;') + '}\
.nrc-panel{width:calc(100vw - 32px);max-height:70vh;' + (posRight ? 'right:-8px;' : 'left:-8px;') + '}\
.nrc-toggle{width:56px;height:56px;}\
.nrc-toggle-avatar{width:48px;height:48px;}\
.nrc-bubble{max-width:200px;' + (posRight ? 'right:0;' : 'left:0;') + '}\
}';
    var el = document.createElement('style');
    el.id = 'nrc-style-el';
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ── Profile image + name rotation (4-hour shifts) ── */
  var _profileRotateTimer = null;
  function getCurrentProfileIndex(cfg) {
    var imgs = cfg && cfg.bot_profile_images;
    if (!imgs || imgs.length <= 1) return 0;
    var ms = cfg.profile_image_interval_ms || (4 * 60 * 60 * 1000);
    return Math.floor(Date.now() / ms) % imgs.length;
  }
  function getCurrentProfileImage(cfg) {
    var imgs = cfg && cfg.bot_profile_images;
    if (!imgs || imgs.length === 0) return (cfg && cfg.bot_profile_image_url) || '';
    if (imgs.length === 1) return imgs[0];
    return imgs[getCurrentProfileIndex(cfg)];
  }
  function getCurrentBotName(cfg) {
    var names = cfg && cfg.bot_names;
    if (!names || names.length === 0) return (cfg && cfg.bot_name) || 'AI Assistant';
    var idx = getCurrentProfileIndex(cfg);
    return names[idx % names.length] || (cfg && cfg.bot_name) || 'AI Assistant';
  }
  function scheduleProfileRotation(cfg) {
    if (_profileRotateTimer) clearTimeout(_profileRotateTimer);
    var imgs = cfg && cfg.bot_profile_images;
    if (!imgs || imgs.length <= 1) return;
    var ms = cfg.profile_image_interval_ms || (4 * 60 * 60 * 1000);
    var delay = ms - (Date.now() % ms);
    _profileRotateTimer = setTimeout(function () {
      var src = getCurrentProfileImage(cfg);
      var name = getCurrentBotName(cfg);
      var avs = document.querySelectorAll('.nrc-msg-bot-av');
      for (var i = 0; i < avs.length; i++) avs[i].src = src;
      var nameEls = document.querySelectorAll('.nrc-header-name');
      for (var n = 0; n < nameEls.length; n++) nameEls[n].textContent = name;
      var headerAvs = document.querySelectorAll('.nrc-header-avatar');
      for (var h = 0; h < headerAvs.length; h++) { headerAvs[h].src = src; headerAvs[h].alt = name; }
      var toggleAvs = document.querySelectorAll('.nrc-toggle-avatar');
      for (var t = 0; t < toggleAvs.length; t++) { toggleAvs[t].src = src; toggleAvs[t].alt = name; }
      scheduleProfileRotation(cfg);
    }, delay);
  }

  /* ── Build Widget DOM ── */
  function buildWidget(c) {
    var profileImg = getCurrentProfileImage(c) || '';
    var logoImg = c.bot_logo_url || '';
    var avatarUrl = profileImg || logoImg || '';
    var botName = getCurrentBotName(c);

    var wrap = document.createElement('div');
    wrap.className = 'nrc-wrap';
    wrap.id = 'nrc-wrap';

    // Toggle button
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'nrc-toggle';
    toggleBtn.setAttribute('aria-label', 'Chat');
    if (avatarUrl) {
      var toggleAv = document.createElement('img');
      toggleAv.className = 'nrc-toggle-avatar';
      toggleAv.src = avatarUrl;
      toggleAv.alt = botName;
      toggleBtn.appendChild(toggleAv);
    }
    var closeIcon = document.createElement('span');
    closeIcon.className = 'nrc-toggle-close';
    closeIcon.textContent = '\u00D7';
    toggleBtn.appendChild(closeIcon);

    // Panel
    var panel = document.createElement('div');
    panel.className = 'nrc-panel';

    // Header
    var header = document.createElement('div');
    header.className = 'nrc-header';
    if (avatarUrl) {
      var headerAv = document.createElement('img');
      headerAv.className = 'nrc-header-avatar';
      headerAv.src = avatarUrl;
      headerAv.alt = botName;
      header.appendChild(headerAv);
    }
    var headerInfo = document.createElement('div');
    headerInfo.className = 'nrc-header-info';
    headerInfo.innerHTML = '<div class="nrc-header-name">' + esc(botName) + '</div><div class="nrc-header-status">' + esc(t.online) + '</div>';
    header.appendChild(headerInfo);

    var resetBtn = document.createElement('button');
    resetBtn.className = 'nrc-header-btn';
    resetBtn.title = t.newChat;
    resetBtn.innerHTML = '&#x21bb;';
    resetBtn.onclick = resetChat;
    header.appendChild(resetBtn);

    // Ticket icon in header (top right, next to close)
    var ticketBtn = document.createElement('button');
    ticketBtn.className = 'nrc-header-btn';
    ticketBtn.title = tt.title;
    ticketBtn.innerHTML = '&#x1F3AB;';
    ticketBtn.onclick = function () { toggleTicketForm(true); };
    header.appendChild(ticketBtn);

    panel.appendChild(header);

    // Messages
    var msgs = document.createElement('div');
    msgs.className = 'nrc-messages';
    msgs.id = 'nrc-messages';
    panel.appendChild(msgs);

    // Ticket form (hidden by default)
    var ticketPanel = document.createElement('div');
    ticketPanel.className = 'nrc-ticket';
    ticketPanel.id = 'nrc-ticket';
    ticketPanel.innerHTML = '<div class="nrc-ticket-title">' + esc(tt.title) + '</div>'
      + '<input type="text" id="nrc-ticket-name" placeholder="' + esc(tt.name) + '">'
      + '<input type="email" id="nrc-ticket-email" placeholder="' + esc(tt.email) + '">'
      + '<input type="text" id="nrc-ticket-subject" placeholder="' + esc(tt.subject) + '">'
      + '<textarea id="nrc-ticket-desc" placeholder="' + esc(tt.desc) + '"></textarea>'
      + '<div class="nrc-ticket-btns">'
      + '<button class="nrc-ticket-cancel" type="button" id="nrc-ticket-cancel">' + esc(tt.cancel) + '</button>'
      + '<button class="nrc-ticket-submit" type="button" id="nrc-ticket-submit">' + esc(tt.submit) + '</button>'
      + '</div>';
    panel.appendChild(ticketPanel);

    // Ticket event wiring
    setTimeout(function () {
      var cancelBtn = $('#nrc-ticket-cancel');
      var submitBtn = $('#nrc-ticket-submit');
      if (cancelBtn) cancelBtn.onclick = function () { toggleTicketForm(false); };
      if (submitBtn) submitBtn.onclick = submitTicket;
    }, 0);

    // Input form
    var form = document.createElement('form');
    form.className = 'nrc-form';
    form.id = 'nrc-form';
    form.onsubmit = function (e) { e.preventDefault(); sendMessage(); };
    var input = document.createElement('input');
    input.className = 'nrc-input';
    input.id = 'nrc-input';
    input.type = 'text';
    input.placeholder = t.placeholder;
    input.autocomplete = 'off';
    form.appendChild(input);
    var sendBtn = document.createElement('button');
    sendBtn.className = 'nrc-send';
    sendBtn.id = 'nrc-send';
    sendBtn.type = 'submit';
    sendBtn.textContent = t.send;
    form.appendChild(sendBtn);
    panel.appendChild(form);

    wrap.appendChild(panel);
    wrap.appendChild(toggleBtn);
    document.body.appendChild(wrap);
    applyPanelTheme();

    // Toggle handler
    toggleBtn.onclick = function () {
      removeBubble();
      isOpen = !isOpen;
      wrap.classList.toggle('nrc-open', isOpen);
      if (isOpen) {
        applyPanelTheme();
        if (msgs.children.length === 0) restoreOrGreet();
        input.focus();
      }
    };
  }

  /* ── Add message to UI ── */
  function addMessage(role, text) {
    var msgs = $('#nrc-messages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'nrc-msg nrc-msg-' + role;
    div.innerHTML = esc(text).replace(/\n/g, '<br>');
    if (role === 'bot' && !isDarkPage()) { div.style.color = '#1a1a1a'; }
    var _botAv = getCurrentProfileImage(config);
    if (role === 'bot' && _botAv) {
      var row = document.createElement('div');
      row.className = 'nrc-bot-row';
      var av = document.createElement('img');
      av.className = 'nrc-msg-bot-av';
      av.src = _botAv;
      av.alt = (config && config.bot_name) || 'Bot';
      row.appendChild(av);
      row.appendChild(div);
      msgs.appendChild(row);
    } else {
      msgs.appendChild(div);
    }
    msgs.scrollTop = msgs.scrollHeight;

    if (role === 'user') {
      msgCount++;
      if (msgCount === 3 && !emailCollected && config && config.email_collection_enabled) {
        showEmailCollector();
      }
    }
  }

  /* ── Typing indicator ── */
  function showTyping() {
    var msgs = $('#nrc-messages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'nrc-typing';
    div.id = 'nrc-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    var _typingAv = getCurrentProfileImage(config);
    if (_typingAv) {
      var row = document.createElement('div');
      row.className = 'nrc-bot-row';
      row.id = 'nrc-typing-row';
      var av = document.createElement('img');
      av.className = 'nrc-msg-bot-av';
      av.src = _typingAv;
      av.alt = (config && config.bot_name) || 'Bot';
      row.appendChild(av);
      row.appendChild(div);
      msgs.appendChild(row);
    } else {
      msgs.appendChild(div);
    }
    msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() {
    var el = $('#nrc-typing-row') || $('#nrc-typing');
    if (el) el.remove();
  }

  /* ── Send message ── */
  function sendMessage() {
    var input = $('#nrc-input');
    var msg = (input.value || '').trim();
    if (!msg || isLoading) return;
    input.value = '';

    addMessage('user', msg);
    showTyping();
    isLoading = true;
    $('#nrc-send').disabled = true;

    var x = new XMLHttpRequest();
    x.open('POST', API_BASE + '/api/chatbot-ext/chat');
    x.setRequestHeader('Content-Type', 'application/json');
    x.setRequestHeader('X-Api-Key', API_KEY);
    x.timeout = 30000;
    x.ontimeout = function () {
      hideTyping();
      isLoading = false;
      $('#nrc-send').disabled = false;
      addMessage('bot', t.errorMsg);
    };
    x.onload = function () {
      hideTyping();
      isLoading = false;
      $('#nrc-send').disabled = false;
      if (x.status === 200) {
        try {
          var data = JSON.parse(x.responseText);
          conversationId = data.conversation_id || conversationId;
          try { localStorage.setItem('nrc_conv_' + API_KEY, conversationId); } catch (_) {}
          addMessage('bot', data.reply || t.errorMsg);
        } catch (e) {
          addMessage('bot', t.errorMsg);
        }
      } else if (x.status === 429) {
        addMessage('bot', t.limitReached);
      } else {
        var apiErr = '';
        try { apiErr = JSON.parse(x.responseText).error || ''; } catch (_) {}
        console.error('[Chat Note] API error ' + x.status + ': ' + apiErr);
        addMessage('bot', apiErr || t.errorMsg);
      }
    };
    x.onerror = function () {
      hideTyping();
      isLoading = false;
      $('#nrc-send').disabled = false;
      addMessage('bot', t.errorMsg);
    };
    var payload = {
      message: msg,
      conversation_id: conversationId,
      visitor_id: visitorId,
      page_url: window.location.href,
      page_context: buildPageContext()
    };
    if (!pageContentSent) {
      try {
        var body = document.body.innerText || '';
        payload.page_content = body.replace(/\s+/g, ' ').trim().slice(0, 3000);
      } catch (e) {}
      pageContentSent = true;
    }
    x.send(JSON.stringify(payload));
  }

  /* ── Email collector ── */
  function showEmailCollector() {
    var msgs = $('#nrc-messages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'nrc-msg nrc-msg-bot';
    div.innerHTML = esc(config.email_collection_msg || t.emailAsk)
      + '<div class="nrc-email-wrap">'
      + '<input class="nrc-email-input" type="email" placeholder="' + esc(t.emailPlaceholder) + '">'
      + '<button class="nrc-email-btn" type="button">' + esc(t.emailSubmit) + '</button>'
      + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;

    var btn = div.querySelector('.nrc-email-btn');
    var inp = div.querySelector('.nrc-email-input');
    btn.onclick = function () {
      var email = (inp.value || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        inp.style.borderColor = '#e74c3c';
        return;
      }
      btn.disabled = true;
      btn.textContent = '...';

      var y = new XMLHttpRequest();
      y.open('POST', API_BASE + '/api/chatbot-ext/collect-email');
      y.setRequestHeader('Content-Type', 'application/json');
      y.setRequestHeader('X-Api-Key', API_KEY);
      y.onload = function () {
        emailCollected = true;
        localStorage.setItem('nrc_email_' + API_KEY, email);
        div.innerHTML = '<span style="color:#4caf50">' + esc(t.emailThanks) + '</span>';
      };
      y.onerror = function () {
        btn.disabled = false;
        btn.textContent = t.emailSubmit;
      };
      y.send(JSON.stringify({ email: email, source_page: window.location.href }));
    };
  }

  /* ── Reset chat ── */
  function resetChat() {
    conversationId = null;
    msgCount = 0;
    pageContentSent = false;
    try { localStorage.removeItem('nrc_conv_' + API_KEY); } catch (_) {}
    var msgs = $('#nrc-messages');
    if (msgs) msgs.innerHTML = '';
    addMessage('bot', t.greeting);
  }

  /* ── Bubble preview (outside panel) ── */
  function isDarkPage() {
    var el = document.documentElement;
    if (el.classList.contains('dark')) return true;
    if (el.dataset && el.dataset.theme === 'dark') return true;
    if (document.body && document.body.classList.contains('dark')) return true;
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch (_) { return false; }
  }

  function applyPanelTheme() {
    var dark = isDarkPage();
    var panel = document.querySelector('.nrc-panel');
    if (!panel) return;
    if (dark) {
      panel.style.background = '#1c2228';
      panel.style.border = '1px solid #323841';
      panel.style.color = '#e0e0e0';
    } else {
      panel.style.background = '#ffffff';
      panel.style.border = '1px solid rgba(0,0,0,.12)';
      panel.style.color = '#1a1a1a';
      panel.style.boxShadow = '0 8px 32px rgba(0,0,0,.12)';
    }
    var inp = document.getElementById('nrc-input');
    if (inp) {
      inp.style.background = dark ? '#252b30' : '#f5f6f8';
      inp.style.border = '1px solid ' + (dark ? '#3a424b' : '#d0d0d0');
      inp.style.color = dark ? '#e0e0e0' : '#1a1a1a';
    }
    var msgs = document.getElementById('nrc-messages');
    if (msgs) {
      msgs.style.background = dark ? '#1c2228' : '#ffffff';
    }
    var botMsgs = document.querySelectorAll('.nrc-msg-bot');
    for (var i = 0; i < botMsgs.length; i++) {
      botMsgs[i].style.color = dark ? '#e0e0e0' : '#1a1a1a';
    }
  }

  function showBubblePreview(text, durationMs) {
    removeBubble();
    if (isOpen) return;
    var wrap = $('#nrc-wrap');
    if (!wrap) return;
    var bubble = document.createElement('div');
    bubble.className = 'nrc-bubble';
    bubble.id = 'nrc-bubble';
    bubble.textContent = text;
    if (isDarkPage()) {
      bubble.style.background = '#1c2228';
      bubble.style.color = '#e0e0e0';
      bubble.style.border = '1px solid rgba(255,255,255,.08)';
      bubble.style.boxShadow = '0 4px 20px rgba(0,0,0,.4)';
    } else {
      bubble.style.background = '#ffffff';
      bubble.style.color = '#1a1a1a';
      bubble.style.border = '1px solid rgba(0,0,0,.08)';
      bubble.style.boxShadow = '0 4px 20px rgba(0,0,0,.15)';
    }
    bubble.onclick = function () {
      removeBubble();
      isOpen = true;
      wrap.classList.add('nrc-open');
      var msgs = $('#nrc-messages');
      if (msgs && msgs.children.length === 0) restoreOrGreet();
      try { $('#nrc-input').focus(); } catch (_) {}
    };
    wrap.appendChild(bubble);
    var toggle = wrap.querySelector('.nrc-toggle');
    if (toggle) toggle.classList.add('nrc-pulse');
    setTimeout(function () { removeBubble(); }, durationMs || 12000);
  }
  function removeBubble() {
    var b = $('#nrc-bubble');
    if (b) b.remove();
    var toggle = $('.nrc-toggle');
    if (toggle) toggle.classList.remove('nrc-pulse');
  }

  /* ── Restore conversation or greet ── */
  function restoreOrGreet() {
    if (conversationId) {
      var x = new XMLHttpRequest();
      x.open('GET', API_BASE + '/api/chatbot-ext/history/' + conversationId + '?key=' + encodeURIComponent(API_KEY));
      x.setRequestHeader('X-Api-Key', API_KEY);
      x.timeout = 4000;
      x.onload = function () {
        if (x.status === 200) {
          try {
            var data = JSON.parse(x.responseText);
            var msgs = data.messages || [];
            if (msgs.length > 0) {
              msgs.forEach(function (m) { addMessage(m.role === 'user' ? 'user' : 'bot', m.content); });
              return;
            }
          } catch (_) {}
        }
        addMessage('bot', t.greeting);
      };
      x.onerror = x.ontimeout = function () { addMessage('bot', t.greeting); };
      x.send();
    } else {
      addMessage('bot', t.greeting);
    }
  }

  /* ── Build page context (structured) ── */
  function buildPageContext() {
    var ctx = { url: window.location.href };
    try {
      var path = window.location.pathname.toLowerCase();

      /* 1) Page type detection - generic patterns */
      if (path === '/' || path === '/index.html' || path === '/index.htm') {
        ctx.page = 'home';
      } else {
        var seg = path.replace(/^\/|\/$/g, '').split('/')[0];
        if (/^(shop|store|products?|catalog|collections?)$/.test(seg)) ctx.page = 'shop';
        else if (/^(pricing|plans|packages)$/.test(seg)) ctx.page = 'pricing';
        else if (/^(services?|solutions|offerings)$/.test(seg)) ctx.page = 'service';
        else if (/^(blog|news|articles?|posts?|journal)$/.test(seg)) ctx.page = path.split('/').filter(Boolean).length > 1 ? 'blog-post' : 'blog';
        else if (/^(contact|support|help)$/.test(seg)) ctx.page = 'contact';
        else if (/^(about|team|company)$/.test(seg)) ctx.page = 'about';
        else ctx.page = seg;
      }

      /* 2) Page title */
      var h1 = document.querySelector('h1');
      if (h1) ctx.title = h1.textContent.trim().slice(0, 120);

      /* 3) Meta description */
      var meta = document.querySelector('meta[name="description"]');
      if (meta) ctx.description = (meta.getAttribute('content') || '').slice(0, 200);

      /* 4) Generic product detection */
      var productEls = document.querySelectorAll(
        '[data-product], [itemtype*="Product"], .product, .product-card, .shop-card, .woocommerce-loop-product'
      );
      if (productEls.length > 0) {
        var products = [];
        for (var pi = 0; pi < productEls.length && pi < 6; pi++) {
          var pe = productEls[pi];
          var pName = (pe.querySelector('[itemprop="name"], .product-name, .product-title, .card-title, h3, h4') || {}).textContent;
          var pPrice = (pe.querySelector('[itemprop="price"], .price, .product-price, .amount') || {}).textContent;
          if (pName) products.push({ name: pName.trim().slice(0, 80), price: (pPrice || '').trim().slice(0, 20) });
        }
        if (products.length) ctx.products = products;
      }

      /* 5) Single product page */
      if (!ctx.products && document.querySelector('[itemtype*="Product"]')) {
        var spName = (document.querySelector('[itemprop="name"]') || h1 || {}).textContent;
        if (spName) ctx.product = spName.trim().slice(0, 120);
      }

      /* 6) Article / blog post */
      var article = document.querySelector('article, [itemtype*="Article"], [itemtype*="BlogPosting"]');
      if (article && (ctx.page === 'blog-post' || ctx.page === 'blog')) {
        ctx.article = ((article.querySelector('h1, [itemprop="headline"]') || h1 || {}).textContent || '').trim().slice(0, 120);
      }

      /* 7) Service page */
      if (ctx.page === 'service' && h1) {
        ctx.service = h1.textContent.trim().slice(0, 120);
      }

      /* 8) Detect visible section */
      var sections = document.querySelectorAll('section[id], [role="region"][id], article[id]');
      for (var si = 0; si < sections.length; si++) {
        var rect = sections[si].getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          ctx.section = sections[si].id || (sections[si].querySelector('h2,h3') || {}).textContent || '';
          break;
        }
      }
    } catch (_) {}
    return ctx;
  }

  /* ── Ticket form toggle ── */
  function toggleTicketForm(show) {
    var tp = $('#nrc-ticket');
    var msgs = $('#nrc-messages');
    var form = $('#nrc-form');
    if (!tp) return;
    _ticketOpen = show;
    if (show) {
      tp.classList.add('nrc-show');
      if (msgs) msgs.style.display = 'none';
      if (form) form.style.display = 'none';
    } else {
      tp.classList.remove('nrc-show');
      if (msgs) msgs.style.display = '';
      if (form) form.style.display = '';
    }
  }

  /* ── Submit ticket ── */
  function submitTicket() {
    var email = ($('#nrc-ticket-email') || {}).value || '';
    var subject = ($('#nrc-ticket-subject') || {}).value || '';
    if (!email.trim() || !subject.trim()) {
      addMessage('bot', tt.required);
      toggleTicketForm(false);
      return;
    }
    var btn = $('#nrc-ticket-submit');
    if (btn) btn.disabled = true;

    var x = new XMLHttpRequest();
    x.open('POST', API_BASE + '/api/chatbot-ext/ticket');
    x.setRequestHeader('Content-Type', 'application/json');
    x.setRequestHeader('X-Api-Key', API_KEY);
    x.onload = function () {
      if (btn) btn.disabled = false;
      toggleTicketForm(false);
      if (x.status === 200) {
        try {
          var data = JSON.parse(x.responseText);
          addMessage('bot', tt.success.replace('{id}', data.ticket_id || ''));
        } catch (_) { addMessage('bot', tt.success.replace('{id}', '')); }
      } else {
        addMessage('bot', tt.fail);
      }
    };
    x.onerror = function () {
      if (btn) btn.disabled = false;
      toggleTicketForm(false);
      addMessage('bot', tt.fail);
    };
    x.send(JSON.stringify({
      conversation_id: conversationId,
      email: email.trim(),
      name: ($('#nrc-ticket-name') || {}).value || '',
      subject: subject.trim(),
      description: ($('#nrc-ticket-desc') || {}).value || ''
    }));
  }

  /* ── Auto greeting on page load (bubble preview) - home/index pages ── */
  function autoGreet() {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    /* Match root, /en, /ko, /ja etc. (2-3 letter lang codes) and /index.html */
    var isHome = path === '/' || /^\/[a-z]{2,3}$/.test(path)
      || path === '/index.html' || path === '/index.htm';
    if (!isHome) return;
    var attempt = 0;
    function tryGreet() {
      var wrap = document.getElementById('nrc-wrap');
      if (!wrap) {
        if (++attempt < 20) setTimeout(tryGreet, 200);
        return;
      }
      showBubblePreview(t.greeting, 3000);
      /* Block section questions for ~5s (greeting bubble + buffer) */
      _lastProactiveTime = Date.now() + 2000;
    }
    tryGreet();
  }

  /* ── Section proactive question (dwell time) ── */
  function initSectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    var timers = {};

    /* Restore previously shown sections from session */
    var sessionShown = getSessionShown();
    for (var k in sessionShown) { _proactiveSections.add(k); }

    /* ── Smart proactive messages — keyword-matched hooking questions ── */
    var _smartHooks = [
      // Pricing / Plans
      { k: /pric|plan|cost|subscri|billing|starter|pro\b|business|enterprise/i,
        en: 'Not sure which plan fits you? I can recommend one based on your needs!',
        es: '\u00BFNo sabe qu\u00E9 plan le conviene? \u00A1Puedo recomendarle uno seg\u00FAn sus necesidades!' },
      // Editor / Writing / Blog
      { k: /editor|write|blog|post|content|publish/i,
        en: 'Did you know our editor auto-saves every 5 seconds and supports 40+ shortcuts? Want a quick tour?',
        es: '\u00BFSab\u00EDa que nuestro editor guarda autom\u00E1ticamente y tiene 40+ atajos? \u00BFQuiere un recorrido r\u00E1pido?' },
      // Design / Theme / Template
      { k: /design|theme|template|customiz|brand|style|layout/i,
        en: 'Looking to customize your site? We have 8+ themes and a full Design Studio \u2014 want to see how it works?',
        es: '\u00BFQuiere personalizar su sitio? Tenemos 8+ temas y un Design Studio completo.' },
      // AI / Automation / Generate
      { k: /\bai\b|artificial|automat|generat|smart|machine|intelli/i,
        en: 'Our AI can write a full SEO-optimized blog post in minutes. Want to know how?',
        es: 'Nuestra IA puede escribir un art\u00EDculo optimizado para SEO en minutos. \u00BFQuiere saber c\u00F3mo?' },
      // Newsletter / Email
      { k: /newsletter|email|campaign|subscrib|inbox|send|mail/i,
        en: 'Need to grow your audience? Our Newsletter OS includes A/B testing and smart scheduling \u2014 ask me more!',
        es: '\u00BFNecesita hacer crecer su audiencia? Nuestro Newsletter OS incluye pruebas A/B.' },
      // Membership / Members / Community
      { k: /member|communit|access|gate|tier|join|sign.?up|register/i,
        en: 'Want to create exclusive member-only content? I can explain how our membership tiers work!',
        es: '\u00BFQuiere crear contenido exclusivo para miembros? \u00A1Puedo explicarle c\u00F3mo funcionan los niveles!' },
      // Monetization / Revenue / Payment
      { k: /monetiz|revenue|pay|earn|income|money|stripe|checkout|commerce/i,
        en: 'Ready to earn from your content? We support subscriptions, paywalls, tips, and coupons \u2014 ask me how!',
        es: '\u00BFListo para ganar con su contenido? Soportamos suscripciones, paywalls, propinas y cupones.' },
      // SEO / Search / Google
      { k: /\bseo\b|search|google|ranking|optimi|keyword|sitemap|meta/i,
        en: 'Our SEO Toolkit scores your content in real-time and auto-generates structured data. Want details?',
        es: 'Nuestro kit SEO eval\u00FAa su contenido en tiempo real. \u00BFQuiere m\u00E1s detalles?' },
      // Domain / Setup / Getting Started
      { k: /domain|setup|start|instal|deploy|ssl|hosting|dns/i,
        en: 'Setting up is easy \u2014 free plan, no credit card, live in minutes. Need help getting started?',
        es: 'Comenzar es f\u00E1cil \u2014 plan gratuito, sin tarjeta, en l\u00EDnea en minutos. \u00BFNecesita ayuda?' },
      // Security / Privacy / GDPR
      { k: /secur|privacy|gdpr|protect|safe|encrypt|ssl|complia/i,
        en: 'Your site runs on 300+ edge locations with built-in WAF and auto SSL \u2014 no server to hack. Questions?',
        es: 'Su sitio funciona en 300+ ubicaciones edge con WAF integrado y SSL autom\u00E1tico.' },
      // Speed / Performance / Fast
      { k: /speed|fast|perform|load|core.?web|vital|lcp|cls/i,
        en: 'We deliver 0.1s load times with Core Web Vitals baked in \u2014 no optimization needed. Want to learn more?',
        es: 'Ofrecemos tiempos de carga de 0.1s con Core Web Vitals integrados.' },
      // Feature / Product / Solution
      { k: /feature|product|solution|capabilit|tool|what.?we|why\b/i,
        en: 'We pack 13 tools into one platform \u2014 editor, AI, email, memberships, payments, and more. What interests you most?',
        es: 'Incluimos 13 herramientas en una plataforma. \u00BFQu\u00E9 le interesa m\u00E1s?' },
      // About / Story / Team / Mission
      { k: /about|story|team|mission|value|who.?we|our\b/i,
        en: 'We built Noteracker to replace WordPress with something 10x faster and simpler. Curious how?',
        es: 'Creamos Noteracker para reemplazar WordPress con algo 10x m\u00E1s r\u00E1pido. \u00BFCurioso?' },
      // Testimonial / Review / Trust
      { k: /testimon|review|trust|customer|success|case.?study|result/i,
        en: 'Creators love our platform for its simplicity and speed. Want to see what you can build?',
        es: 'Los creadores aman nuestra plataforma por su simplicidad. \u00BFQuiere ver lo que puede crear?' },
      // Contact / Support / Help
      { k: /contact|support|help|question|faq|ask/i,
        en: 'I\'m here to help! Ask me anything about our platform, pricing, or features.',
        es: '\u00A1Estoy aqu\u00ED para ayudar! Preg\u00FAnteme sobre la plataforma, precios o funciones.' },
      // Hero / Welcome / Home
      { k: /hero|welcome|home|landing|get.?start|discover|explor/i,
        en: 'Welcome! Want a quick overview of what Noteracker can do for your business?',
        es: '\u00A1Bienvenido! \u00BFQuiere una vista r\u00E1pida de lo que Noteracker puede hacer por su negocio?' },
      // Gallery / Portfolio / Showcase
      { k: /gallery|portfolio|showcas|image|photo|visual/i,
        en: 'Love what you see? Our Design Studio lets you build pages like this without coding!',
        es: '\u00BFLe gusta lo que ve? Nuestro Design Studio le permite crear p\u00E1ginas as\u00ED sin programar.' },
      // Migration / WordPress / Import
      { k: /migrat|wordpress|import|switch|transfer|move/i,
        en: 'Switching from WordPress? We import your posts, tags, and images in one click!',
        es: '\u00BFViene de WordPress? Importamos sus posts, etiquetas e im\u00E1genes en un clic.' },
      // API / Developer / Integration
      { k: /\bapi\b|develop|integrat|webhook|sdk|code|programm/i,
        en: 'Our Enterprise plan includes full REST API, webhooks, and SDKs. Need technical details?',
        es: 'Nuestro plan Enterprise incluye API REST completa, webhooks y SDKs.' },
      // Chatbot / Chat / Support Bot
      { k: /chatbot|chat.?note|widget|bot|live.?chat|support.?chat/i,
        en: 'This chatbot you\'re seeing? You can add it to your own site too! Ask me how.',
        es: '\u00BFEste chatbot que ve? \u00A1Puede a\u00F1adirlo a su propio sitio! Preg\u00FAnteme c\u00F3mo.' },
    ];

    /* fallback generic templates */
    var _sqt = {
      en: [
        'Interested in "{s}"? I can share more details!',
        'Want to know how "{s}" can help your business?',
        'Exploring "{s}"? Let me know if you have questions!',
      ],
      es: [
        '\u00BFInteresado en "{s}"? \u00A1Puedo darle m\u00E1s detalles!',
        '\u00BFQuiere saber c\u00F3mo "{s}" puede ayudar a su negocio?',
      ],
      ko: ['"{s}"\uc5d0 \ub300\ud574 \uad81\uae08\ud55c \uc810\uc774 \uc788\uc73c\uc2e0\uac00\uc694?'],
      ja: ['\u300C{s}\u300D\u306B\u3064\u3044\u3066\u3054\u8CEA\u554F\u306F\u3042\u308A\u307E\u3059\u304B\uFF1F'],
      zh: ['\u5173\u4E8E\u201C{s}\u201D\u6709\u4EC0\u4E48\u95EE\u9898\u5417\uFF1F'],
      fr: ['Avez-vous une question sur "{s}" ?'],
      de: ['Haben Sie eine Frage zu "{s}"?'],
      pt: ['Tem alguma d\u00FAvida sobre "{s}"?'],
      it: ['Hai una domanda su "{s}"?'],
      vi: ['B\u1EA1n c\u00F3 c\u00E2u h\u1ECFi v\u1EC1 "{s}" kh\u00F4ng?'],
      id: ['Ada pertanyaan tentang "{s}"?'],
      th: ['\u0E21\u0E35\u0E04\u0E33\u0E16\u0E32\u0E21\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A "{s}" \u0E44\u0E2B\u0E21?'],
      ar: ['\u0647\u0644 \u0644\u062F\u064A\u0643 \u0633\u0624\u0627\u0644 \u062D\u0648\u0644 "{s}"\u061F'],
      ms: ['Ada soalan tentang "{s}"?'],
      hi: ['"{s}" \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0915\u094B\u0908 \u0938\u0935\u093E\u0932?'],
      sv: ['Har du en fr\u00E5ga om "{s}"?'],
      fi: ['Onko sinulla kysytt\u00E4v\u00E4\u00E4 aiheesta "{s}"?'],
      da: ['Har du et sp\u00F8rgsm\u00E5l om "{s}"?'],
      hu: ['Van k\u00E9rd\u00E9se a(z) "{s}" t\u00E9m\u00E1ban?'],
      he: ['\u05D9\u05E9 \u05DC\u05DA \u05E9\u05D0\u05DC\u05D4 \u05E2\u05DC "{s}"?'],
    };

    function getSmartMessage(headingText) {
      var lang = config._lang || 'en';
      /* 1) Try keyword-matched hook */
      for (var i = 0; i < _smartHooks.length; i++) {
        if (_smartHooks[i].k.test(headingText)) {
          return _smartHooks[i][lang] || _smartHooks[i].en;
        }
      }
      /* 2) Fallback: random from template array */
      var arr = _sqt[lang] || _sqt.en;
      var tmpl = arr[Math.floor(Math.random() * arr.length)];
      return tmpl.replace('{s}', headingText);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        var q = el._nrcQ;
        if (!q) return;
        var id = q.slice(0, 50);
        if (entry.isIntersecting) {
          if (_proactiveSections.has(id)) return;
          timers[id] = setTimeout(function () {
            var now = Date.now();
            if (now - _lastProactiveTime < 3000) return;
            markSectionShown(id);
            _lastProactiveTime = now;
            showBubblePreview(q);
          }, _sectionDwellMs);
        } else {
          if (timers[id]) { clearTimeout(timers[id]); delete timers[id]; }
        }
      });
    }, { threshold: [0, 0.2] });

    var seen = new Set();

    /* Store ref for re-engagement scanning */
    var _observedList = window._nrcObservedEls || [];

    /* 1) data-chat-question (manual) */
    var manual = document.querySelectorAll('[data-chat-question]');
    manual.forEach(function (el) {
      el._nrcQ = el.getAttribute('data-chat-question');
      seen.add(el);
      observer.observe(el);
      _observedList.push(el);
    });

    /* 2) All semantic containers */
    document.querySelectorAll('section, article, [role="region"], main > div, .section-block').forEach(function (el) {
      if (seen.has(el) || el.offsetHeight < 80) return;
      var h = el.querySelector('h1, h2, h3, h4, .section-title, .section-heading');
      if (!h) return;
      var txt = (h.textContent || '').trim();
      if (!txt || txt.length < 3 || txt.length > 120) return;
      // Skip headings with non-Latin characters (Korean/CJK/Arabic etc.) when UI is English
      if (/[\u1100-\uD7FF\uAC00-\uD7A3\u3040-\u9FFF\u0600-\u06FF]/.test(txt)) return;
      seen.add(el);
      el._nrcQ = getSmartMessage(txt);
      observer.observe(el);
      _observedList.push(el);
    });

    /* 3) Heading-based: parent of every h1-h4 */
    var vh3 = window.innerHeight * 3;
    document.querySelectorAll('h1, h2, h3, h4, .section-title, .section-heading').forEach(function (h) {
      var txt = (h.textContent || '').trim();
      if (!txt || txt.length < 3 || txt.length > 120) return;
      // Skip headings with non-Latin characters (Korean/CJK/Arabic etc.) when UI is English
      if (/[\u1100-\uD7FF\uAC00-\uD7A3\u3040-\u9FFF\u0600-\u06FF]/.test(txt)) return;
      var sec = h.closest('section') || h.closest('article') || h.closest('[id]') || h.parentElement;
      /* If parent is oversized (page-builder wrapper), walk up from heading
         to find the first container >= 100px but < 3x viewport height */
      if (sec && (seen.has(sec) || sec.offsetHeight > vh3)) {
        var p = h.parentElement;
        sec = null;
        while (p && p !== document.body && p !== document.documentElement) {
          if (p.offsetHeight >= 100 && p.offsetHeight < vh3 && !seen.has(p)) { sec = p; break; }
          p = p.parentElement;
        }
      }
      if (!sec || sec === document.body || sec === document.documentElement) return;
      if (seen.has(sec) || sec.offsetHeight < 80) return;
      seen.add(sec);
      sec._nrcQ = getSmartMessage(txt);
      observer.observe(sec);
      _observedList.push(sec);
    });
  }

  /* ── Re-engage on tab return / idle return ── */
  function setupReEngagement() {
    var _visibleEls = [];

    function scanVisibleSections() {
      if (isOpen || !_visibleEls.length) return;
      var now = Date.now();
      if (now - _lastProactiveTime < 8000) return;
      for (var i = 0; i < _visibleEls.length; i++) {
        var el = _visibleEls[i];
        var q = el._nrcQ;
        if (!q) continue;
        var id = q.slice(0, 50);
        if (_proactiveSections.has(id)) continue;
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          markSectionShown(id);
          _lastProactiveTime = now;
          showBubblePreview(q);
          return;
        }
      }
    }

    /* On tab return from hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') { _wasHidden = true; return; }
      if (_wasHidden) {
        _wasHidden = false;
        setTimeout(scanVisibleSections, 300);
      }
    });

    /* On window focus (back from other app/tab) */
    window.addEventListener('focus', function () {
      if (_wasHidden) {
        _wasHidden = false;
        setTimeout(scanVisibleSections, 300);
      }
    });

    /* On scroll/click after idle return - immediate response */
    var _lastActivity = Date.now();
    function onActivity() {
      var now = Date.now();
      var gap = now - _lastActivity;
      _lastActivity = now;
      /* If gap > 5 seconds, user was idle - scan on return */
      if (gap > 5000) {
        scanVisibleSections();
      }
    }
    window.addEventListener('scroll', onActivity, { passive: true });
    window.addEventListener('click', onActivity, { passive: true });

    /* Store observed elements for re-scan */
    window._nrcObservedEls = _visibleEls;
  }

  /* ── Close chatbot when clicking outside ── */
  function setupOutsideClick() {
    document.addEventListener('click', function (e) {
      if (!isOpen) return;
      var wrap = document.getElementById('nrc-wrap');
      if (!wrap) return;
      if (!wrap.contains(e.target)) {
        isOpen = false;
        wrap.classList.remove('nrc-open');
      }
    });
  }

  /* ── Init ── */
  function init() {
    loadConfig(function (c) {
      injectStyles(c);
      buildWidget(c);
      setupReEngagement();
      setupOutsideClick();
      autoGreet();
      initSectionObserver();
    });
  }

  /* ── Public reload API — call window.ChatNote.reload() after saving settings */
  window.ChatNote = window.ChatNote || {};
  window.ChatNote.reload = function () {
    setTimeout(function () {
    loadConfig(function (cfg) {
      /* Apply all runtime settings from DB */
      _sectionDwellMs = parseInt(cfg.section_dwell_time) || 2000;
      t.greeting = cfg.bot_greeting || cfg.welcome_message || t.greeting;

      var botName = getCurrentBotName(cfg);
      var src = getCurrentProfileImage(cfg);
      var logoSrc = cfg.bot_logo_url || '';
      var nextAvatarSrc = src || logoSrc || '';

      // 1. CSS 전체 갱신 — 색상·크기 등 모든 스타일 즉시 반영
      var oldStyle = document.getElementById('nrc-style-el');
      if (oldStyle && oldStyle.parentNode) oldStyle.parentNode.removeChild(oldStyle);
      injectStyles(cfg);

      // 2. 봇 이름 갱신
      var nameEls = document.querySelectorAll('.nrc-header-name');
      for (var n = 0; n < nameEls.length; n++) nameEls[n].textContent = botName;

      // 3. 프로필 이미지 갱신
      var toggleBtn = $('.nrc-toggle');
      if (toggleBtn) {
        var exAv = toggleBtn.querySelector('.nrc-toggle-avatar');
        var closeBtn = toggleBtn.querySelector('.nrc-toggle-close');
        if (nextAvatarSrc) {
          if (exAv) {
            exAv.src = nextAvatarSrc;
            exAv.alt = botName;
          } else {
            var newAv = document.createElement('img');
            newAv.className = 'nrc-toggle-avatar';
            newAv.src = nextAvatarSrc;
            newAv.alt = botName;
            if (closeBtn) toggleBtn.insertBefore(newAv, closeBtn);
            else toggleBtn.appendChild(newAv);
          }
        } else if (exAv && exAv.parentNode) {
          exAv.parentNode.removeChild(exAv);
        }
      }

      if (nextAvatarSrc) {
        // 토글 버튼 — 이미지 없으면 새로 생성, 있으면 src 교체
        // 헤더 아바타
        var header = $('.nrc-header');
        var headerInfo = $('.nrc-header-info', header || document);
        var headerAvs = document.querySelectorAll('.nrc-header-avatar');
        if (headerAvs.length === 0 && header) {
          var newHeaderAv = document.createElement('img');
          newHeaderAv.className = 'nrc-header-avatar';
          newHeaderAv.src = nextAvatarSrc;
          newHeaderAv.alt = botName;
          if (headerInfo) header.insertBefore(newHeaderAv, headerInfo);
          else header.insertBefore(newHeaderAv, header.firstChild);
          headerAvs = document.querySelectorAll('.nrc-header-avatar');
        }
        for (var i = 0; i < headerAvs.length; i++) {
          headerAvs[i].src = nextAvatarSrc;
          headerAvs[i].alt = botName;
        }
        // 봇 메시지 아바타
        var botAvs = document.querySelectorAll('.nrc-msg-bot-av');
        for (var j = 0; j < botAvs.length; j++) botAvs[j].src = nextAvatarSrc;
      } else {
        var oldHeaderAvs = document.querySelectorAll('.nrc-header-avatar');
        for (var h = 0; h < oldHeaderAvs.length; h++) {
          if (oldHeaderAvs[h].parentNode) {
            oldHeaderAvs[h].parentNode.removeChild(oldHeaderAvs[h]);
          }
        }
      }

      scheduleProfileRotation(cfg);
    }, true);
    }, 400);
  };

  /* ── Public toggle / open / close API ── */
  window.ChatNote.toggle = function () {
    var wrap = $('#nrc-wrap');
    if (!wrap) return;
    removeBubble();
    isOpen = !isOpen;
    wrap.classList.toggle('nrc-open', isOpen);
    if (isOpen) {
      applyPanelTheme();
      var msgs = $('#nrc-messages');
      if (msgs && msgs.children.length === 0) restoreOrGreet();
      var inp = $('#nrc-input');
      if (inp) inp.focus();
    }
  };
  window.ChatNote.open = function () { if (!isOpen) window.ChatNote.toggle(); };
  window.ChatNote.close = function () { if (isOpen) window.ChatNote.toggle(); };

  window.addEventListener('storage', function (e) {
    if (e.key === 'nrc_cfg_ts') { window.ChatNote.reload(); }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
