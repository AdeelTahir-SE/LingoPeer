Add-Type -AssemblyName System.Drawing

$src = [System.Drawing.Bitmap]::FromFile("E:\codingfolder\LingoPeer\lingopeer\ui-designs\learn-agentselection.png")

# Screen 2 is roughly x: 195 to 370, y: 0 to 370
# Agent 1 (Sofia): x: 212, y: 172, w: 26, h: 26
# Agent 2 (Diego): x: 212, y: 209, w: 26, h: 26
# Agent 3 (Lucia): x: 212, y: 247, w: 26, h: 26
# Agent 4 (Mateo): x: 212, y: 285, w: 26, h: 26

function Crop-Avatar($name, $x, $y, $w, $h) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = $src.Clone($rect, $src.PixelFormat)
    $bmp.Save("E:\codingfolder\LingoPeer\lingopeer\assets\images\$name.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Crop-Avatar "agent-sofia" 211 170 27 27
Crop-Avatar "agent-diego" 211 207 27 27
Crop-Avatar "agent-lucia" 211 245 27 27
Crop-Avatar "agent-mateo" 211 283 27 27

$src.Dispose()
Write-Host "Agent avatars cropped!"
