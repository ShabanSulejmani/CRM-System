CRM-system Testinställningar
Detta dokument förklarar hur man ställer in och kör tester för CRM-systemet som beskrivs i förstudien och kunskapsrapporten.
Förutsättningar

Lokal utvecklingsserver (localhost:5000)
PostgreSQL-databas
Postman för API-testning
SpecFlow och Playwright för UI-testning

Databasinställning

Skapa databastabeller enligt den tillhandahållna databasstrukturen
Konfigurera Role-tabellen:

Infoga id = 1, name = 'Staff'
Infoga id = 2, name = 'Admin'
Infoga id = 3, name = 'Super-Admin'


Skapa initiala användare i User-tabellen:

Admin-användare:

first_name: Admin
password: 123
company: tele
role_id:2
email:Admin@test.se


Vanlig personalanvändare:

first_name: Saban
password: 123
company: tele
role_id:1
email:Saban@test.se



E-postadresser kan vara i vilket giltigt format som helst



Köra tester
Postman-tester

Importera Postman-kollektionsfilen
Ställ in miljövariabler:

Se till att ställa in variabeln user_id till 3 för att säkerställa korrekt borttagning av testanvändaren som skapas under testerna


Kör kollektionen för att testa:

Autentisering
Ärendehantering
Chattfunktionalitet
Användaradministration



OBS! I Postman kan man köra hela mappen som ett flöde, vilket gör att testerna körs i rätt ordning och beroenden mellan testerna hanteras korrekt.
UI-tester med SpecFlow och Playwright

Öppna testprojektet i din IDE
Bygg lösningen
Kör tester med Test Explorer eller kommandoraden:
dotnet test


Testfall som täcks

Inloggning med olika användarroller
Formulär för ärenderegistrering för tre branscher (Tele/Bredband, Fordon, Försäkring)
Chattfunktionalitet kopplad till varje ärende
Ärendeöversikt och statushantering
Administrativ användarhantering

Kända problem

CI/CD med Git Actions kan misslyckas med felmeddelandet "fatal: in unpopulated submodule 'CRM'" på grund av strukturen i arkivet

Tips för testkörning

Se till att den lokala utvecklingsservern körs på port 5000 innan du startar testen
Om tester misslyckas på grund av tidsproblem, justera väntetiderna i Playwright-testerna
Se till att databasen är i ett rent tillstånd innan testerna körs för konsekventa resultat
För upprepade testkörningar kan du behöva rensa testdata manuellt mellan körningarna

Felsökning
Om du stöter på problem med Postman-testerna:

Verifiera att alla miljövariabler är korrekt inställda
Kontrollera att API-slutpunkterna matchar din lokala implementation
Se till att databasen innehåller den nödvändiga initiala datan
