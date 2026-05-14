import jwt from 'jsonwebtoken';

/* Lỗi xác thực phải là 401 (không phải 500) — vì lỗi đến từ client gửi
   thiếu/sai token, không phải server bug. 500 đang gây hiểu nhầm khi debug.

   Trả thêm `code: 'NO_TOKEN' | 'BAD_TOKEN'` để client biết phân biệt
   (vd: NO_TOKEN → chuyển trang sign-in; BAD_TOKEN → xoá token rồi yêu cầu đăng nhập lại). */
const auth = async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Missing authentication token', code: 'NO_TOKEN' });
    }

    try {
        const isCustomAuth = token.length < 500;

        let decodedData;

        if (isCustomAuth) {
            decodedData = jwt.verify(token, 'test');
            req.userId = decodedData?.id;
        } else {
            /* Google OAuth token: chỉ decode (signature verify để bước sau, khi
               tích hợp Google libs đầy đủ). Tạm thời tin cậy như cũ. */
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }

        if (!req.userId) {
            return res.status(401).json({ message: 'Invalid token payload', code: 'BAD_TOKEN' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token', code: 'BAD_TOKEN' });
    }
};

export default auth;