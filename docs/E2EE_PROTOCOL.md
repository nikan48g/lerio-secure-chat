# پروتکل هدف End-to-End Encryption لریو

> وضعیت: طراحی برای پیاده‌سازی و ممیزی؛ هنوز در production فعال اعلام نشده است.

## اصول

1. هر دستگاه یک جفت کلید هویت مستقل دارد و کلید خصوصی non-extractable است.
2. سرور فقط کلید عمومی و envelope کلید گفتگو را نگه می‌دارد.
3. هر گفتگو epoch دارد و با تغییر اعضا یا revoke دستگاه، کلید عوض می‌شود.
4. هر پیام با AEAD و nonce یکتا رمز می‌شود.
5. شناسهٔ گفتگو، فرستنده، epoch و counter به‌عنوان AAD احراز می‌شوند.
6. هر فایل قبل از upload با کلید تصادفی مستقل رمز می‌شود.

## envelope پیام

```json
{
  "v": 1,
  "suite": "lerio-e2ee-v1",
  "conversation_id": 42,
  "epoch": 7,
  "sender_device_id": "base64url-id",
  "counter": 108,
  "nonce": "base64url",
  "ciphertext": "base64url"
}
```

## پیش‌نیاز فعال‌سازی

- migration برای device keys، conversation epochs و encrypted envelopes
- برچسب واضح پیام‌های قدیمی به‌عنوان رمزنشده
- تست حداقل دو حساب و سه دستگاه
- رمزنگاری attachment و voice پیش از upload
- جستجوی محلی به‌جای جستجوی متن در سرور
- test vector عمومی، CI و ممیزی مستقل

