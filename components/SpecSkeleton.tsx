function Bar({ w }: { w: string }) {
  return <div className={`h-3.5 rounded-full bg-gray-200 ${w}`} />;
}

function SectionCard({
  children,
  border = 'border-gray-200',
  bg = 'bg-white',
}: {
  children: React.ReactNode;
  border?: string;
  bg?: string;
}) {
  return (
    <section className={`rounded-2xl border ${border} ${bg} p-6 shadow-sm animate-pulse`}>
      {children}
    </section>
  );
}

function SectionLabel({ color }: { color: string }) {
  return <div className={`h-3 w-20 rounded-full mb-5 ${color}`} />;
}

export default function SpecSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 animate-pulse">
        <div className="h-5 w-48 rounded-full bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-lg bg-gray-100" />
          <div className="h-8 w-24 rounded-lg bg-gray-100" />
          <div className="h-8 w-16 rounded-lg bg-gray-100" />
          <div className="h-8 w-20 rounded-lg bg-gray-100" />
        </div>
      </div>

      {/* 1. Vision */}
      <SectionCard border="border-indigo-100" bg="bg-indigo-50">
        <SectionLabel color="bg-indigo-200" />
        <div className="flex flex-col gap-2.5">
          <Bar w="w-full" />
          <Bar w="w-11/12" />
          <Bar w="w-4/5" />
        </div>
      </SectionCard>

      {/* 2. Target Users */}
      <SectionCard>
        <SectionLabel color="bg-sky-200" />
        <div className="rounded-xl bg-sky-50 border border-sky-100 p-4 flex flex-col gap-2.5">
          <Bar w="w-full" />
          <Bar w="w-10/12" />
          <Bar w="w-3/4" />
        </div>
      </SectionCard>

      {/* 3. Features */}
      <SectionCard>
        <SectionLabel color="bg-emerald-200" />
        <div className="flex flex-col gap-4">
          <div>
            <div className="h-3 w-28 rounded-full bg-emerald-100 mb-3" />
            <div className="flex flex-col gap-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-200" />
                  <Bar w={i === 1 ? 'w-10/12' : 'w-full'} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-3 w-28 rounded-full bg-indigo-100 mb-3" />
            <div className="flex flex-col gap-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-200" />
                  <Bar w={i === 2 ? 'w-9/12' : 'w-full'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* 4. User Flows */}
      <SectionCard>
        <SectionLabel color="bg-amber-200" />
        <div className="flex flex-col gap-5">
          {[...Array(2)].map((_, fi) => (
            <div key={fi} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-full bg-amber-200 flex-shrink-0" />
                <div className="h-3.5 w-36 rounded-full bg-gray-200" />
                <div className="ml-auto h-5 w-20 rounded-full bg-green-100" />
              </div>
              <div className="flex flex-col gap-2 mb-3 pl-2">
                {[...Array(3)].map((_, si) => (
                  <div key={si} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-amber-200 flex-shrink-0" />
                    <Bar w={si === 1 ? 'w-10/12' : 'w-full'} />
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2">
                <div className="h-5 w-16 rounded-full bg-red-100 flex-shrink-0" />
                <Bar w="w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 5. Architecture */}
      <SectionCard>
        <SectionLabel color="bg-violet-200" />
        <div className="rounded-xl bg-violet-50 border border-violet-100 p-4 flex flex-col gap-2.5">
          <Bar w="w-full" />
          <Bar w="w-11/12" />
          <Bar w="w-3/4" />
        </div>
      </SectionCard>

      {/* 6. Requirements */}
      <SectionCard>
        <SectionLabel color="bg-rose-200" />
        <div className="flex flex-col gap-4">
          <div>
            <div className="h-3 w-16 rounded-full bg-green-100 mb-3" />
            <div className="flex flex-col gap-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-green-200 flex-shrink-0" />
                  <Bar w={i === 2 ? 'w-10/12' : 'w-full'} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="h-3 w-24 rounded-full bg-red-100 mb-3" />
            <div className="flex flex-col gap-2.5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-200 flex-shrink-0" />
                  <Bar w={i === 1 ? 'w-9/12' : 'w-full'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
