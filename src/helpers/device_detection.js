function isPhone() {
  if (window.innerWidth < 450 || window.innerHeight < 450) {
    return true
  }
  return false
}
function isTablet() {
  if ((window.innerWidth > 449 && window.innerWidth < 900) || (window.innerHeight > 449 && window.innerHeight < 900)) {
    return true
  }
  return false
}

module.exports = {
  isPhone,
  isTablet,
}
