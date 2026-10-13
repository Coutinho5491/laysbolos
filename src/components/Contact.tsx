import { useId, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Check, CircleAlert, Send } from 'lucide-react';
import { STORES, getStore, type StoreId } from '../data/stores';
import { whatsappUrl } from '../lib/links';
import { WhatsAppIcon } from './Brand';
import { Picture } from './Picture';
import { Reveal } from './Reveal';

const SUBJECTS = ['Fazer um pedido', 'Consultar disponibilidade', 'Outro assunto'] as const;

interface FormState {
  store: StoreId | '';
  name: string;
  subject: (typeof SUBJECTS)[number];
  message: string;
}

type Errors = Partial<Record<'store' | 'name' | 'message', string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.store) e.store = 'Escolha a loja com a qual deseja conversar.';
  if (f.name.trim().length < 2) e.name = 'Informe seu nome (pelo menos 2 letras).';
  if (f.message.trim().length < 5) e.message = 'Conte em poucas palavras o que você deseja.';
  return e;
}

function buildMessage(f: FormState) {
  const store = getStore(f.store as StoreId);
  return [
    `Olá! Meu nome é ${f.name.trim()}.`,
    `Assunto: ${f.subject} — ${store.shortName}.`,
    '',
    f.message.trim(),
  ].join('\n');
}

export function Contact() {
  const uid = useId();
  const [form, setForm] = useState<FormState>({ store: '', name: '', subject: SUBJECTS[0], message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<{ url: string; store: string; blocked: boolean } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((e) => ({ ...e, [key]: undefined }));
    setResult(null);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }
    const store = getStore(form.store as StoreId);
    const url = whatsappUrl(store, buildMessage(form));
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    // `null` indica que o navegador bloqueou a nova aba — oferecemos o link manual
    setResult({ url, store: store.shortName, blocked: !win });
  };

  const err = (k: keyof Errors) => errors[k] && (
    <p className="field__error" id={`${uid}-${k}-error`}>
      <CircleAlert size={14} strokeWidth={1.8} aria-hidden="true" />
      {errors[k]}
    </p>
  );

  return (
    <section id="contato" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__intro">
          <Reveal>
            <p className="eyebrow">Contato</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="contact-title" className="section-title">
              Ficou com vontade? <em>Vamos conversar!</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="section-lead">
              Monte sua mensagem aqui e nós a abrimos no WhatsApp da loja escolhida. Lá, é só revisar e tocar em
              enviar — a resposta vem diretamente da equipe da loja.
            </p>
          </Reveal>
          <Reveal delay={240} variant="image" className="contact__photo">
            <Picture
              id="cookies-nutella"
              alt="Cookies recheados com Nutella embalados para presente com laço verde"
              sizes="(min-width: 1024px) 30vw, 92vw"
            />
          </Reveal>
        </div>

        <Reveal delay={120} className="contact__card">
          <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`}>
            <fieldset className="field" aria-describedby={errors.store ? `${uid}-store-error` : undefined}>
              <legend className="field__label">Com qual loja você quer falar?</legend>
              <div className="store-radios">
                {STORES.map((s, i) => (
                  <label key={s.id} className={`store-radio ${form.store === s.id ? 'is-checked' : ''}`}>
                    <input
                      type="radio"
                      name="store"
                      value={s.id}
                      checked={form.store === s.id}
                      onChange={() => update('store', s.id)}
                      data-field={i === 0 ? 'store' : undefined}
                      aria-invalid={!!errors.store}
                    />
                    <span className="store-radio__check" aria-hidden="true">
                      <Check size={14} strokeWidth={2.4} />
                    </span>
                    <span>
                      <strong>{s.shortName}</strong>
                      <small>{s.street}</small>
                    </span>
                  </label>
                ))}
              </div>
              {err('store')}
            </fieldset>

            <div className="field">
              <label className="field__label" htmlFor={`${uid}-name`}>
                Seu nome
              </label>
              <input
                id={`${uid}-name`}
                data-field="name"
                className="input"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${uid}-name-error` : undefined}
                maxLength={80}
              />
              {err('name')}
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${uid}-subject`}>
                Assunto
              </label>
              <select
                id={`${uid}-subject`}
                className="input select"
                value={form.subject}
                onChange={(e) => update('subject', e.target.value as FormState['subject'])}
              >
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor={`${uid}-message`}>
                Mensagem
              </label>
              <textarea
                id={`${uid}-message`}
                data-field="message"
                className="input textarea"
                rows={4}
                placeholder="Ex.: Gostaria de saber quais doces vocês têm hoje."
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${uid}-message-error` : undefined}
                maxLength={600}
              />
              {err('message')}
            </div>

            <button type="submit" className="button button--primary button--block">
              <WhatsAppIcon size={18} />
              Abrir no WhatsApp
              <Send size={16} strokeWidth={1.8} aria-hidden="true" />
            </button>

            <p className="form__note" id={`${uid}-note`}>
              A mensagem será aberta no WhatsApp e só é enviada quando você tocar em enviar. Não há confirmação
              automática de pedidos.
            </p>

            <div aria-live="polite" className="form__status-wrap">
              {result && (
                <div className={`form__status ${result.blocked ? 'is-warning' : 'is-success'}`}>
                  {result.blocked ? (
                    <CircleAlert size={18} strokeWidth={1.8} aria-hidden="true" />
                  ) : (
                    <Check size={18} strokeWidth={2} aria-hidden="true" />
                  )}
                  <div>
                    <p>
                      {result.blocked
                        ? 'O navegador bloqueou a nova aba. Use o botão abaixo para abrir a conversa.'
                        : `Mensagem pronta no WhatsApp da ${result.store}. Lembre-se de tocar em enviar por lá.`}
                    </p>
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-link">
                      {result.blocked ? 'Abrir WhatsApp' : 'Não abriu? Abrir novamente'}
                      <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
