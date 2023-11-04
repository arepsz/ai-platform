import Image from "next/image"

interface EmptyProps {
    label: string
}

export const Empty = ({
    label
}: EmptyProps) => {
    return (
        <>
            <div className="h-fill p-20 flex flex-col items-center
            justify-center">
                <div className="relative h-72 w-80">
                    <Image 
                        alt="Empty"
                        fill
                        src="/empty.png"
                    />
                </div>
            </div>
            <p className="text-muted-foreground text-sm text-center">
                {label}
            </p>
            <div className="flex justify-end">
                <footer className="sticky top-[100vh] text-yellow-500/20">
                    <a target="_blank" href='https://pngtree.com/freepng/social-media-concept-in-3d-isometric-outline-design-woman-browses-on-laptop-creates-profile-watches-video-content-likes-and-shares-posts-line-web-template-vector-illustration-with-people-scene_7601730.html'>png image from pngtree.com/</a>
                </footer>
            </div>
        </>
    )
}