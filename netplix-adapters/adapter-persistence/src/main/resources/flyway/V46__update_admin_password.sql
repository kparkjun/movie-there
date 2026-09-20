-- 관리자(admin) 계정 비밀번호 변경: 3819 -> spring3819
-- App Store 심사(2.1a) 대응으로 단순 비밀번호(3819)를 강화한다.
-- 아이디는 'admin' 그대로, 비밀번호만 spring3819 로 변경.
UPDATE `admin`
SET PASSWORD = '$2b$10$xbAVBu6mxXeDxO5K7vtpmONHTiu1SCOlI2bv8OOuXwZx3dw/m2LYG',
    MODIFIED_AT = NOW(),
    MODIFIED_BY = 'system'
WHERE ADMIN_ID = 'admin';
