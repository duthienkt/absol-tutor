<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Editor</title>
    <script src="ABSOL_DEPENDENT_URL_STRING"></script>
    <script src="ABSOL_URL_STRING"></script>
    <link rel="icon" href="https://absol.cf/favicon.ico">
</head>

<body>
<style>
    html, body{
        padding: 0;
        margin: 0;
        overflow: hidden;
        border: none;
        width: 100%;
        height: 100%;
    }

    .as-full-screen{
        width: 100%;
        height: 100%;
    }
</style>
<script>
    const EDITOR_CHANNEL = "EDITOR_CHANNEL_STRING";
</script>
<script>
    var editor = new absol.tutor.SplitEditor(EDITOR_CHANNEL, Math.random()+'');
    editor.getView().addClass('as-full-screen').addTo(document.body);
    editor.start();
</script>
</body>
</html>
