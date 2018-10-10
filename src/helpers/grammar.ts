export function platformToEnglish (platform: NodeJS.Platform) {
  switch (platform) {
    case 'win32':
      return 'Windows'
    case 'sunos':
      return 'SunOS'
    case 'openbsd':
      return 'OpenBSD'
    case 'freebsd':
      return 'FreeBSD'
    case 'linux':
      return 'Linux'
    case 'darwin':
      return 'Darwin'
    case 'android':
      return 'Android'
    case 'aix':
      return 'AIX'
    default:
      return 'Unknown'
  }
}
