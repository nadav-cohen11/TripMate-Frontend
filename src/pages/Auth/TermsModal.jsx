const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#eaf4ff] to-[#dbeeff] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-xl" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#2D4A53]">Terms of Use</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="bi bi-x text-2xl"></i>
          </button>
        </div>
        <div className="space-y-4 text-[#2D4A53]">
          <div className="border-b pb-4">
            <h3 className="font-bold mb-2">תקנון שימוש באפליקציית TripMate</h3>
            <p>1. קבלת תנאים</p>
            <p>השימוש באפליקציה מהווה הסכמה מלאה ומפורשת לתקנון זה ולמדיניות הפרטיות של TripMate.</p>
          </div>
          <div className="border-b pb-4">
            <p>2. גיל מינימלי לשימוש</p>
            <p>השירות מיועד למשתמשים בני 16 ומעלה. קטינים נדרשים לקבל אישור מהורה או אפוטרופוס.</p>
          </div>
          <div className="border-b pb-4">
            <p>3. אחריות המשתמש</p>
            <p>המשתמש אחראי באופן בלעדי לתוכן שהוא מעלה, לשיחות שהוא מקיים ולמידע שהוא משתף באפליקציה. חל איסור לשלוח תוכן פוגעני, גזעני, מיני, אלים, שקרי, מאיים או בלתי חוקי.</p>
          </div>
          <div className="border-b pb-4">
            <p>4. תקשורת בצ'אט</p>
            <p>כל שיחה פרטית בצ'אט, שיתוף תמונות או מידע אישי נעשית על אחריות המשתמש בלבד. TripMate אינה מתחייבת לאמת זהויות של משתמשים ואינה נושאת באחריות לנזקים כתוצאה מהתנהלות המשתמשים.</p>
          </div>
          <div className="border-b pb-4">
            <p>5. פרטיות ושימוש במידע</p>
            <p>השימוש באפליקציה כפוף למדיניות הפרטיות. ייתכן וייאסף מידע לצרכים סטטיסטיים, תפעוליים ואבטחתיים. לא יימסר מידע אישי לגורם שלישי ללא אישור, אלא אם נדרש לפי חוק.</p>
          </div>
          <div className="border-b pb-4">
            <p>6. חסימת משתמשים והסרת תוכן</p>
            <p>TripMate שומרת לעצמה את הזכות להסיר תוכן, לחסום גישה או להשעות משתמשים שהפרו את התקנון לפי שיקול דעתה הבלעדי.</p>
          </div>
          <div className="border-b pb-4">
            <p>7. הגבלת אחריות</p>
            <p>האפליקציה מוצעת כמות שהיא ("As-Is") וללא אחריות מכל סוג. TripMate לא תהיה אחראית לכל נזק, ישיר או עקיף, שייגרם מהשימוש בשירות או כתוצאה ממנו.</p>
          </div>
          <div className="border-b pb-4">
            <p>8. שיפוי</p>
            <p>המשתמש מתחייב לשפות את TripMate, עובדיה ומנהליה בגין כל נזק, הוצאה, או תביעה שתוגש בעקבות הפרה של תקנון זה או שימוש לא תקין באפליקציה.</p>
          </div>
          <div className="border-b pb-4">
            <p>9. זכויות יוצרים</p>
            <p>כל הזכויות באפליקציה, לרבות עיצוב, תוכן, וקוד מקור, שמורות ליוצריה:</p>
            <p>בר יוסף טייר, נדב כהן, ליאן הרשקוביץ</p>
            <p>ובליווי המנטור נתי פוריש</p>
            <p>אין לעשות כל שימוש באלמנטים אלו ללא אישור מפורש בכתב.</p>
          </div>
          <div className="border-b pb-4">
            <p>10. שינויים בתקנון</p>
            <p>TripMate רשאית לעדכן תקנון זה בכל עת. הודעה על כך תופיע באפליקציה או תישלח למשתמש. המשך השימוש מהווה הסכמה לתקנון המעודכן.</p>
          </div>
          <div className="border-b pb-4">
            <p>11. סמכות שיפוט</p>
            <p>הדין החל הוא הדין הישראלי. סמכות השיפוט הבלעדית – בתי המשפט במחוז תל אביב.</p>
          </div>

          <div className="border-t-2 border-gray-300 pt-6 mt-6" dir="ltr">
            <h3 className="font-bold mb-4 text-xl">TripMate App – Terms of Use</h3>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="font-semibold">1. Acceptance of Terms</p>
                <p>By using the TripMate app, you fully agree to these Terms of Use and the Privacy Policy.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">2. Minimum Age</p>
                <p>The app is intended for users aged 16 and above. Minors may use the app only with parental or legal guardian consent.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">3. User Responsibility</p>
                <p>You are solely responsible for any content you upload, messages you send, and interactions with others. Offensive, racist, sexual, violent, false, threatening, or illegal content is strictly prohibited.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">4. Chat Communications</p>
                <p>All private conversations, image sharing, or personal disclosures are at the user's own risk. TripMate does not verify user identities and assumes no liability for user conduct.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">5. Privacy & Data Use</p>
                <p>Use of the app is subject to the Privacy Policy. We may collect data for statistical, operational, or security purposes. Personal data will not be shared without consent, except as required by law.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">6. Content Removal and Account Suspension</p>
                <p>TripMate reserves the right to remove content, restrict access, or suspend users who violate these terms, at its sole discretion.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">7. Limitation of Liability</p>
                <p>The app is provided "as-is" without warranties of any kind. TripMate shall not be liable for any damages arising from use of the app or interactions between users.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">8. Indemnification</p>
                <p>You agree to indemnify TripMate, its employees and managers, from any loss, expense, or claim resulting from your breach of these terms or improper use of the app.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">9. Copyright Notice</p>
                <p>All intellectual property in the app – including design, content, and source code – is owned by:</p>
                <p>Bar Yosef Tair, Nadav Cohen, Lian Hershkovits,</p>
                <p>under the mentorship of Nati Forish.</p>
                <p>No content may be copied, distributed, or used without prior written permission.</p>
              </div>
              <div className="border-b pb-4">
                <p className="font-semibold">10. Changes to Terms</p>
                <p>TripMate may update these terms at any time. Updates will be posted in the app or sent by email. Continued use constitutes acceptance of the new terms.</p>
              </div>
              <div>
                <p className="font-semibold">11. Jurisdiction</p>
                <p>These terms are governed by the laws of the State of Israel. Jurisdiction lies solely with the competent courts of Tel Aviv.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;