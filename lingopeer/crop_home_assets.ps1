Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("E:\codingfolder\LingoPeer\lingopeer\ui-designs\signup-login-home.png")

# Avatar
$avatarRect = New-Object System.Drawing.Rectangle(1425, 95, 55, 55)
$avatar = $src.Clone($avatarRect, $src.PixelFormat)
$avatar.Save("E:\codingfolder\LingoPeer\lingopeer\assets\images\user-avatar.png", [System.Drawing.Imaging.ImageFormat]::Png)
$avatar.Dispose()

# Hero Character (right section of hero banner: character with purple hoodie, black headphones, "Hello!" bubble)
$heroRect = New-Object System.Drawing.Rectangle(1295, 160, 180, 225)
$heroChar = $src.Clone($heroRect, $src.PixelFormat)
$heroChar.Save("E:\codingfolder\LingoPeer\lingopeer\assets\images\home-hero-character.png", [System.Drawing.Imaging.ImageFormat]::Png)
$heroChar.Dispose()

$src.Dispose()
Write-Host "Cropped assets successfully!"
