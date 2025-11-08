import { useState, type PropsWithChildren } from 'react';
import PackageHeader from '@/components/package-header';
import { Auth, TourPackage } from '@/types';
import { Check, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/components/ui/loading-provider';
import { router } from '@inertiajs/react';
import clsx from 'clsx';

interface PackagHeaderLayoutProps {
  id?: number;
  packages: TourPackage;
  auth?: Auth,
  isWishlisted?: boolean;
  editable?: boolean;
}

export default function PackagHeaderLayout({
  id,
  children,
  packages,
  auth,
  isWishlisted,
  editable,
}: PropsWithChildren<PackagHeaderLayoutProps>) {

  const { start, stop } = useLoading();
  
  const [ imageBanner, setImageBanner ] = useState<string>();

  const [ imageFile, setImageFile ] = useState<File | null>(null);

  const [ isEditing, setIsEditing ] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if(file && setImageBanner) {
          const url = URL.createObjectURL(file);
          setImageBanner(url);
          setImageFile?.(file);
      }
  }

  const handleEditBtn = () => {
    //setIsEditing(true);
    if (!id) return;

    router.get(`/packages/${id}/edit`);
  }

  const handleSaveBtn = (e: React.MouseEvent) => {
    e.stopPropagation();

    const formData = new FormData();

    if(imageFile) {
      formData.append('image_banner', imageFile);
    }

    formData.append("_method", "PUT");

    if(imageBanner) {
      start();

      router.post(`/packages/${id}`, formData, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsEditing(false);
          stop();
        }
      });

      return;
    }

    setIsEditing(false);
  }

  return (
    <div className="bg-white dark:bg-transparent max-w-7xl mx-auto px-4 py-8">
      
      {!isEditing && (
        <PackageHeader
          id={id}
          title={packages.title}
          subtitle={packages.subtitle}
          base_price={packages.base_price}
          imageBanner={packages.image_banner as string}
          created_at={packages.created_at}
          updated_at={packages.updated_at}
          textSize="large"
          slug={packages.slug}
          auth={auth}
          isWishlisted={isWishlisted}
        />
      )}

      {isEditing && (
        <PackageHeader
          handleImageUpload={handleImageUpload}
          imageBanner={imageBanner}
          title={packages.title}
          editable>
            {editable && (
              <div
                className="flex justify-end top-4 right-4 absolute z-[99]" 
                onClick={handleSaveBtn}
              >
                  <Button className="btn-primary cursor-pointer">
                      <Check className="w-4 h-4 text-white" />
                  </Button>
              </div>
            )}
          </PackageHeader>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">{children}</div>

        <aside className="w-full lg:w-80">
          <div className="sticky top-20">
            <iframe
              title="Facebook Page"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTigertoursinCavite&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="100%"
              height="500"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </aside>
      </div>
    </div>
  );
}
