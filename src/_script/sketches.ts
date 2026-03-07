import { sketchManifest } from "./sketch-manifest"

type SketchModule = {
    create?: (el: HTMLDivElement, options?: string) => void | Promise<void>
}

function normalizeManifestKey(pathname: string): string {
    return pathname.replace(/^\/+/, "").replace(/\/+$/, "")
}

function resolvePathWithUrl(path: string, baseDir: string): string {
    const resolved = new URL(path, `${window.location.origin}${baseDir}`).pathname
    return normalizeManifestKey(resolved)
}

function searchLoaderByPath(path: string, baseDir: string): (() => Promise<unknown>) | null {
    const resolvedPath = resolvePathWithUrl(path, baseDir)

    if (resolvedPath in sketchManifest) {
        console.log(`[sketch] path found, path: ${path}, resolved: ${resolvedPath}`)
        return sketchManifest[resolvedPath].loader;
    }

    console.log(`[sketch] path not found, path: ${path}, resolved: ${resolvedPath}`)
    return null
}

function searchLoaderByName(name: string): (() => Promise<unknown>) | null {
    const fallbackName = normalizeManifestKey(name).split("/").pop() ?? normalizeManifestKey(name)

    for (const key in sketchManifest) {
        if (key.endsWith(`/${fallbackName}`) || key === fallbackName) {
            console.log(`[sketch] name found: ${name}`)
            return sketchManifest[key].loader
        }
    }

    console.log(`[sketch] name not found: ${name}`)

    return null
}

// urlを正規化。index.*の場合はディレクトリと同一視。ディレクトリのURLで、かつ末尾に/がない場合は/を付与する。
function normalizePath(path: string): string {
    if (path.endsWith("/")) return path; // path/ -> path/ 
    if (/\/index\.[^\/\.]*$/.test(path)) return path.replace(/\/index\.[^\/\.]*$/, "/"); // path/index.* -> path/
    if (/\/[^\/\.]+$/.test(path)) return path + "/"; // path -> path/
    return path; // path/xxx.ext -> path/xxx.ext
}

async function mountSketch(el: HTMLDivElement) {
    const name = el.getAttribute("data-name")
    if (!name) return

    const options = el.getAttribute("data-options") ?? undefined
    const basePath = normalizePath(location.pathname);
    const baseParent = basePath.endsWith("/")
        ? basePath.replace(/\/[^\/]*\/$/, "/")
        : basePath.replace(/\/[^\/]*$/, "/");

    try {
        // pretty URL対策
        const loader = basePath.endsWith("/")
            ? searchLoaderByPath(name, baseParent) || searchLoaderByPath(name, basePath) || searchLoaderByName(name)
            : searchLoaderByPath(name, baseParent) || searchLoaderByName(name);

        if (!loader) {
            console.error(`[sketch] loader not found: ${name}`)
            return
        }

        const module = await loader() as SketchModule
        if (typeof module.create !== "function") {
            console.error(`[sketch] create() is not exported: ${name}`)
            return
        }

        await module.create(el, options)
    } catch (error) {
        console.error(`[sketch] failed to load: ${name}`, error)
    }
}

export function initSketches() {
    document.querySelectorAll(".sketch").forEach(el => {
        void mountSketch(el as HTMLDivElement)
    })
}
