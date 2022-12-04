import fs from "fs"

export default function getFiles(directory)
{
    return fs.readdirSync(directory).filter((file) => file.endsWith(".js"))
}