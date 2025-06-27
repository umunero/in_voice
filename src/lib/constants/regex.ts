export const NUMBER_ONLY_REGEX = /\D/g;
export const FLOAT_ONLY_REGEX = /[^0-9.]/g;
export const REMOVE_ZERO_PREFIX_REGEX = /^0+(?=\d)/;
export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!@#\$&*~])(?=.*?[0-9])[A-Za-z0-9!@#\$&*~]{8,16}$/;
export const NICKNAME_FIRST_LETTER_REGEX = /^[a-zA-Z]$/;
export const CONTACT_PHONE_FORMAT_REGEX = {
    "+60": /^1[0-46-9][0-9]{7,8}$/
}
export const ALPHA_NUMBER_ONLY_REGEX = /[^a-zA-Z0-9]/g
export const ASCII_PRINTABLE = /[^\x20-\x7E]/g