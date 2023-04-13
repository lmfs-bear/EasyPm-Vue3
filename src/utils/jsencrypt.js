import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALjYTUjyA/Yfwvh5w0+MVgZvH86lVfPK\n' +
'ZW24LepATwELsPVqDx3FSFp8TkcnD2BFh7ZkpQAQIeMhWX7wg546eJMCAwEAAQ=='

const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEAuNhNSPID9h/C+HnD\n' +
  'T4xWBm8fzqVV88plbbgt6kBPAQuw9WoPHcVIWnxORycPYEWHtmSlABAh4yFZfvCD\n' +
  'njp4kwIDAQABAkATyGKNGgm+f6u4OB/lFZnnWmFHFn7adqDgW0PevD84Vz8kSIjJ\n' +
  'd4LEVlPXKrhxqEYYGSbzBocZLqJyvu469frhAiEA8pAnbYmB7OUjVTM6qIykKniE\n' +
  '3khGJZTdBLXEZb+YbDsCIQDDFaHtDtBg8E6shccv/gPrR67nMe6NbyAQs86ScxnX\n' +
  'iQIhALTl5UG/x3HRAaTM6/Y/zT8PWqgb5pSojJyyoqHvXdF5AiB8UPW+HhmWHKzV\n' +
  '7e4v3BxdO3HurHgLMwxo+FwkISsPmQIgSlIAA6U7zLYrB2OFGkOpBDucelGWmT6Y\n' +
  'BduI/VqQNIY='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

