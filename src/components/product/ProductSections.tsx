import { Check, Image as ImageIcon, Play } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { bundleTiers, productContent, shop, sizes, type SizeName } from "@/data/product";
import { bundleQuote, isAvailable, moneyFromCents } from "@/lib/product";

function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="product-section-heading">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="product-section-description">{description}</p>}
  </div>;
}

export function BundleSection({ price }: { price: number }) {
  const c = productContent.sections;
  return <section className="product-band" aria-labelledby="product-bundles">
    <div className="page-width product-section">
      <SectionHeading eyebrow={c.bundleEyebrow} title={c.bundleTitle} description={c.bundleDescription} />
      <div className="product-bundle-grid">
        {bundleTiers.map((tier) => {
          const quote = bundleQuote(price, tier);
          return <article key={tier.qty} className={`product-bundle-card ${"popular" in tier && tier.popular ? "is-popular" : ""}`}>
            {"popular" in tier && tier.popular && <span className="product-card-badge">{c.popular}</span>}
            <p className="product-bundle-qty">{tier.qty} <span>{c.lures}</span></p>
            <p className="product-bundle-discount">{Math.round(tier.discount * 100)}% {c.off}</p>
            <dl>
              <div><dt>{moneyFromCents(quote.unitCents)}</dt><dd>{c.each}</dd></div>
              <div><dt>{c.save} {moneyFromCents(quote.savingCents)}</dt></div>
            </dl>
          </article>;
        })}
      </div>
      <div className="product-bundle-notes"><p>{c.automatic}</p><p>{c.mix}</p></div>
    </div>
  </section>;
}

export function TimberSection() {
  const c = productContent.sections;
  return <section className="page-width product-section" aria-labelledby="product-timber">
    <SectionHeading eyebrow={c.timberEyebrow} title={c.timberTitle} />
    <div className="product-comparison" role="table" aria-label={c.timberTitle}>
      <div className="product-comparison-row product-comparison-head" role="row">
        <span role="columnheader" />
        <strong role="columnheader">{c.timberMaster}</strong>
        <strong role="columnheader">{c.timberPlastic}</strong>
      </div>
      {productContent.timberRows.map((row) => <div className="product-comparison-row" role="row" key={row.label}>
        <span role="rowheader">{row.label}</span>
        <span role="cell" className="product-master-cell"><Check aria-hidden="true" />{row.masters}</span>
        <span role="cell">{row.plastic}</span>
      </div>)}
    </div>
    <div className="product-benefits">
      {productContent.benefits.map((benefit, index) => <article key={benefit.title}>
        <span className="product-benefit-number">{String(index + 1).padStart(2, "0")}</span>
        <h3>{benefit.title}</h3><p>{benefit.text}</p>
      </article>)}
    </div>
  </section>;
}

export function CatchesSection() {
  const c = productContent.sections;
  return <section className="product-band" aria-labelledby="product-catches">
    <div className="page-width product-section">
      <div className="product-catches-heading">
        <SectionHeading title={c.catchesTitle} />
        <div><a href="https://www.instagram.com/filletandreleaseco/" target="_blank" rel="noreferrer">{c.catchesHandle}</a><p>{c.catchesTag}</p></div>
      </div>
      <div className="product-catch-grid">
        {productContent.catchPlaceholders.map((item) => <div className="product-catch-placeholder" key={item.label} role="img" aria-label={item.kind === "video" ? c.videoPlaceholder : c.photoPlaceholder}>
          {item.kind === "video" ? <Play aria-hidden="true" /> : <ImageIcon aria-hidden="true" />}
          <span>{item.label}</span>
        </div>)}
      </div>
    </div>
  </section>;
}

export function SizeChart({ selectedColour, selectedSize, onSelect }: { selectedColour: Parameters<typeof isAvailable>[0]; selectedSize: SizeName; onSelect: (size: SizeName) => void }) {
  const c = productContent.sections;
  const b = productContent.buy;
  return <section className="page-width product-section" aria-labelledby="product-chart">
    <SectionHeading eyebrow={c.chartEyebrow} title={c.chartTitle} />
    <div className="product-chart-scroll">
      <table className="product-chart">
        <thead><tr><th>{c.chartSize}</th><th>{c.chartWeight}</th><th>{c.chartWater}</th><th>{b.splitRings}</th><th>{b.hooks}</th><th><span className="sr-only">{c.chartAction}</span></th></tr></thead>
        <tbody>{sizes.map((size) => {
          const available = isAvailable(selectedColour, size.size);
          return <tr key={size.size} className={selectedSize === size.size ? "is-selected" : ""}>
            <th scope="row">{size.size}</th><td>{size.weight}</td><td>{size.water}</td><td>{size.rings ?? b.contact}</td><td>{size.hooks ?? b.contact}</td>
            <td><button type="button" disabled={!available} onClick={() => onSelect(size.size)}>{available ? c.selectSize.replace("{size}", size.size) : b.soldOut}</button></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  </section>;
}

export function ActionSection({ onFloating }: { onFloating: () => void }) {
  const c = productContent.sections;
  return <section className="product-band" aria-labelledby="product-actions">
    <div className="page-width product-section">
      <SectionHeading title={c.actionTitle} description={c.actionDescription} />
      <div className="product-action-grid">
        {productContent.actionChoices.map((choice) => <article className="product-action-card" key={choice.title}>
          <div className="product-action-image"><img src={choice.image} alt={`${choice.title} Masters stickbait`} loading="lazy" /></div>
          <div className="product-action-copy"><p className="eyebrow">{choice.range} · {moneyFromCents(choice.fromPrice)}</p><h3>{choice.title}</h3><p>{choice.description}</p>
            {choice.current ? <button type="button" className="product-outline-button" onClick={onFloating}>{choice.cta}</button> : <a className="product-outline-button" href={choice.href}>{choice.cta}</a>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}

export function ReviewsSection() {
  const c = productContent.sections;
  return <section id="reviews" className="page-width product-section scroll-mt-24" aria-labelledby="product-reviews">
    <SectionHeading eyebrow={c.reviewsEyebrow} title={c.reviewsTitle} />
    <div className="product-rating-summary">
      <strong>{shop.rating}</strong><div><div className="product-stars" aria-hidden="true">★★★★★</div><p>{shop.reviewCount} {productContent.buy.reviews}</p></div>
    </div>
    <div className="product-review-track" tabIndex={0} aria-label={c.reviewsTitle}>
      {productContent.reviews.map((review, index) => <article className="product-review-card" key={`${review.name}-${index}`}>
        {review.placeholder ? <>
          <p className="eyebrow">{c.reviewPlaceholder}</p><p className="product-review-placeholder">{c.reviewPending}</p>
        </> : <>
          <div className="product-stars" aria-hidden="true">★★★★★</div>
          <blockquote>“{review.text}”</blockquote>
          <footer><strong>{review.name}</strong>{review.verified && <span><Check aria-hidden="true" />{c.verified}</span>}</footer>
        </>}
      </article>)}
    </div>
  </section>;
}

export function QuestionsSection() {
  const c = productContent.sections;
  return <section className="page-width product-section product-questions" aria-labelledby="product-questions">
    <SectionHeading title={c.questionsTitle} description={c.questionsDescription} />
    <Accordion type="single" collapsible className="product-question-list">
      {productContent.questions.map((question, index) => <AccordionItem value={`question-${index}`} key={question.q}>
        <AccordionTrigger>{question.q}</AccordionTrigger><AccordionContent>{question.a}</AccordionContent>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
